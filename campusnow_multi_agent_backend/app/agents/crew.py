from __future__ import annotations

import json
from crewai import Agent, Task, Crew, Process, LLM
from app.config import settings
from app.models import RoutingOutput, VerificationOutput, CommunityOutput
from app.guardrails import (
    validate_routing_output,
    validate_verification_output,
    validate_community_output,
)


def _extract_pydantic(task_output, model):
    if hasattr(task_output, "pydantic") and task_output.pydantic is not None:
        result = task_output.pydantic
    elif hasattr(task_output, "raw"):
        result = model.model_validate_json(task_output.raw)
    else:
        result = model.model_validate(task_output)
    return result


# The bootcamp pattern: each Agent has a specific role, goal, backstory and LLM.
routing_llm = LLM(model=settings.openai_model, temperature=0.1)
verification_llm = LLM(model=settings.openai_model, temperature=0.0)
community_llm = LLM(model=settings.openai_model, temperature=0.0)


routing_agent = Agent(
    role="Campus Request and Routing Specialist",
    goal=(
        "Classify a student's campus request, preserve the specified campus location, "
        "decide whether live human input is needed, and route the request to the safest "
        "and most relevant source without exposing individual location data."
    ),
    backstory=(
        "You are a smart-campus operations specialist. You understand university help requests, "
        "location-based questions, lost-and-found, place status and events. "
        "You never infer a person's exact location and you clearly distinguish live community "
        "information from official university information."
    ),
    llm=routing_llm,
    verbose=False,
    allow_delegation=False,
    max_iter=settings.max_agent_iter,
)

verification_agent = Agent(
    role="Campus Trust and Verification Specialist",
    goal=(
        "Evaluate the supplied evidence, distinguish verified presence from unverified claims, "
        "detect conflicts, calculate a conservative confidence score, and produce an answer "
        "that states uncertainty whenever the evidence is insufficient."
    ),
    backstory=(
        "You are a skeptical information-quality reviewer. You never invent live campus facts. "
        "You prefer recent, presence-verified, mutually consistent evidence and keep an auditable "
        "list of evidence IDs used in your conclusion."
    ),
    llm=verification_llm,
    verbose=False,
    allow_delegation=False,
    max_iter=settings.max_agent_iter,
)

community_agent = Agent(
    role="Campus Community and Volunteer Specialist",
    goal=(
        "Evaluate which community responses made a useful verified contribution, assign only "
        "small participation points, flag suspicious activity, and decide whether the contribution "
        "should be sent to a human administrator for volunteer-credit review."
    ),
    backstory=(
        "You manage a fair university helper community. You reward useful participation but never "
        "approve official volunteer hours yourself. You avoid rewarding spam, duplicated responses "
        "or responses from users whose presence could not be verified when presence matters."
    ),
    llm=community_llm,
    verbose=False,
    allow_delegation=False,
    max_iter=settings.max_agent_iter,
)


def run_routing_agent(question: str, location_id: str) -> RoutingOutput:
    schema = json.dumps(RoutingOutput.model_json_schema(), ensure_ascii=False)
    task = Task(
        description=(
            "Classify and route the following university-campus request.\n\n"
            f"QUESTION: {question}\n"
            f"LOCATION_ID: {location_id}\n\n"
            "The location_id is user-selected and MUST be preserved exactly. "
            "Do not infer or output a person's location. "
            "Use category=place_status for crowding/open/availability questions; "
            "help for requests for nearby assistance; lost_found for lost/found property; "
            "event for campus activities; otherwise other.\n\n"
            f"Return data matching this exact schema:\n{schema}"
        ),
        expected_output="A schema-compliant RoutingOutput object.",
        output_pydantic=RoutingOutput,
        agent=routing_agent,
    )
    crew = Crew(
        agents=[routing_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=False,
    )
    crew.kickoff()
    return validate_routing_output(_extract_pydantic(task.output, RoutingOutput))


def run_verification_agent(
    question: str,
    location_id: str,
    responses: list[dict],
    university_records: list[dict] | None = None,
) -> VerificationOutput:
    university_records = university_records or []
    evidence = {
        "community_responses": responses,
        "university_records": university_records,
    }
    schema = json.dumps(VerificationOutput.model_json_schema(), ensure_ascii=False)

    task = Task(
        description=(
            "Verify a live campus request using ONLY the supplied evidence.\n\n"
            f"QUESTION: {question}\nLOCATION_ID: {location_id}\n\n"
            f"EVIDENCE_JSON:\n{json.dumps(evidence, ensure_ascii=False, default=str)}\n\n"
            "Rules:\n"
            "1. Never invent occupancy, opening status, names, locations, or official rules.\n"
            "2. Prefer recent responses with presence_verified=true.\n"
            "3. If evidence conflicts, lower confidence and set conflicting_evidence=true.\n"
            "4. If there are fewer than 2 useful independent community confirmations and no "
            "reliable university record, normally mark sufficient_evidence=false.\n"
            "5. evidence_used must contain source IDs from the supplied JSON only.\n"
            "6. Confidence is 0-100 and should be conservative.\n\n"
            f"Return data matching this exact schema:\n{schema}"
        ),
        expected_output="A schema-compliant VerificationOutput grounded only in supplied evidence.",
        output_pydantic=VerificationOutput,
        agent=verification_agent,
    )
    crew = Crew(
        agents=[verification_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=False,
    )
    crew.kickoff()
    return validate_verification_output(
        _extract_pydantic(task.output, VerificationOutput)
    )


def run_community_agent(
    question: str,
    responses: list[dict],
    verification: VerificationOutput,
) -> CommunityOutput:
    schema = json.dumps(CommunityOutput.model_json_schema(), ensure_ascii=False)
    task = Task(
        description=(
            "Evaluate community participation for this campus request.\n\n"
            f"QUESTION: {question}\n"
            f"RESPONSES_JSON:\n{json.dumps(responses, ensure_ascii=False, default=str)}\n\n"
            f"VERIFICATION_RESULT:\n{verification.model_dump_json()}\n\n"
            "Rules:\n"
            "- Award 0-5 points per response, never more.\n"
            "- A useful, presence-verified response that supports the verified conclusion may earn points.\n"
            "- Do not reward spam, duplicates, irrelevant answers, or unsupported certainty.\n"
            "- volunteer_review_required means ONLY that a human review record should be created; "
            "it does not mean official hours are approved.\n"
            "- Set moderation_required=true only when supplied evidence indicates suspicious or abusive behavior.\n\n"
            f"Return data matching this exact schema:\n{schema}"
        ),
        expected_output="A schema-compliant CommunityOutput with contribution decisions.",
        output_pydantic=CommunityOutput,
        agent=community_agent,
    )
    crew = Crew(
        agents=[community_agent],
        tasks=[task],
        process=Process.sequential,
        verbose=False,
    )
    crew.kickoff()
    return validate_community_output(
        _extract_pydantic(task.output, CommunityOutput)
    )
