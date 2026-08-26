from __future__ import annotations

from datetime import datetime, timezone
from app.agents.crew import run_routing_agent, run_verification_agent, run_community_agent
from app.guardrails import validate_user_input
from app.models import (
    CreateCampusRequest,
    CreateRequestResult,
    RequestStatus,
    VerifyRequestResult,
)
from app.services.supabase_service import db


def create_and_route_request(payload: CreateCampusRequest) -> CreateRequestResult:
    payload = validate_user_input(payload)

    routing = run_routing_agent(
        question=payload.question,
        location_id=payload.location_id,
    )

    row = db.create_request(
        requester_id=payload.requester_id,
        location_id=payload.location_id,
        question=payload.question,
        routing=routing.model_dump(mode="json"),
    )

    active = db.active_checkins(payload.location_id)
    db.log_agent_action(
        row["id"],
        "Campus Request and Routing Specialist",
        routing.model_dump(mode="json"),
    )

    status = RequestStatus(row["status"])
    return CreateRequestResult(
        request_id=row["id"],
        status=status,
        routing=routing,
        eligible_responder_count=len(active),
        message=(
            "Request routed. Waiting for recent community confirmations."
            if routing.needs_live_human_input
            else "Request routed and can be verified using available records."
        ),
    )


def _add_freshness_and_trust(responses: list[dict]) -> list[dict]:
    now = datetime.now(timezone.utc)
    enriched = []

    for response in responses:
        item = dict(response)
        try:
            created = datetime.fromisoformat(
                str(response["created_at"]).replace("Z", "+00:00")
            )
            item["freshness_minutes"] = max(
                0, int((now - created).total_seconds() // 60)
            )
        except Exception:
            item["freshness_minutes"] = 9999

        reputation = db.get_reputation(response["responder_id"])
        item["trust_score"] = int(reputation.get("trust_score", 50))
        enriched.append(item)

    return enriched


def verify_and_reward(request_id: str) -> VerifyRequestResult:
    request = db.get_request(request_id)
    if not request:
        raise ValueError("Request not found.")

    responses = _add_freshness_and_trust(db.get_responses(request_id))

    # This is where you can later load official university records.
    # Keep it empty unless your university supplies a trusted source/API.
    university_records: list[dict] = []

    verification = run_verification_agent(
        question=request["question"],
        location_id=request["location_id"],
        responses=responses,
        university_records=university_records,
    )
    db.log_agent_action(
        request_id,
        "Campus Trust and Verification Specialist",
        verification.model_dump(mode="json"),
    )

    if not verification.sufficient_evidence:
        db.set_request_status(
            request_id,
            RequestStatus.LOW_CONFIDENCE.value,
            verification=verification.model_dump(mode="json"),
        )
        return VerifyRequestResult(
            request_id=request_id,
            status=RequestStatus.LOW_CONFIDENCE,
            verification=verification,
            community=None,
        )

    community = run_community_agent(
        question=request["question"],
        responses=responses,
        verification=verification,
    )
    db.log_agent_action(
        request_id,
        "Campus Community and Volunteer Specialist",
        community.model_dump(mode="json"),
    )

    known_responders = {r["responder_id"] for r in responses}
    for decision in community.contribution_decisions:
        if decision.responder_id not in known_responders:
            continue  # never reward an identity invented by the LLM
        if decision.eligible and decision.points_awarded > 0:
            db.add_points(decision.responder_id, decision.points_awarded)

    if community.volunteer_review_required:
        db.create_human_review(
            request_id,
            {
                "community_output": community.model_dump(mode="json"),
                "verification_output": verification.model_dump(mode="json"),
            },
        )

    db.set_request_status(
        request_id,
        RequestStatus.VERIFIED.value,
        verification=verification.model_dump(mode="json"),
    )

    return VerifyRequestResult(
        request_id=request_id,
        status=RequestStatus.VERIFIED,
        verification=verification,
        community=community,
    )
