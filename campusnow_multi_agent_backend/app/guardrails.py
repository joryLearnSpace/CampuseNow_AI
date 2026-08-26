import re
from app.models import CreateCampusRequest, RoutingOutput, VerificationOutput, CommunityOutput
from app.config import settings


PROMPT_INJECTION_PATTERNS = [
    r"ignore (all|any|the) previous",
    r"ignore your (rules|instructions)",
    r"reveal (the )?(system|developer) prompt",
    r"show me .* exact location",
    r"list .* students .* (here|location|building)",
    r"give me .* private data",
]


class GuardrailViolation(ValueError):
    pass


def validate_user_input(payload: CreateCampusRequest) -> CreateCampusRequest:
    text = payload.question.strip()

    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            raise GuardrailViolation(
                "The request was blocked because it attempts to bypass safety rules or access private location data."
            )

    # Never allow a question to request precise whereabouts of a named person.
    if re.search(r"(where is|location of|أين|موقع)\s+[\w\u0600-\u06FF]{2,}", text, re.IGNORECASE):
        # We only block obvious person-tracking phrasing; normal place-status requests still pass.
        person_tracking_markers = ["where is ", "location of ", "أين فلان", "موقع فلان"]
        if any(marker.lower() in text.lower() for marker in person_tracking_markers):
            raise GuardrailViolation("Exact person-location tracking is not supported.")

    payload.question = text
    return payload


def validate_routing_output(output: RoutingOutput) -> RoutingOutput:
    if output.risk_level == "high" and output.preferred_source == "community":
        # High-risk requests must not rely on community-only evidence.
        output.preferred_source = "both"
    return output


def validate_verification_output(output: VerificationOutput) -> VerificationOutput:
    if output.confidence_score < settings.min_verification_confidence:
        output.sufficient_evidence = False
        if not output.warning:
            output.warning = (
                "There is not enough reliable recent information. "
                "Please wait for more confirmations or check an official university source."
            )
    if not output.evidence_used:
        output.sufficient_evidence = False
        output.confidence_score = min(output.confidence_score, 40)
        output.warning = output.warning or "No auditable evidence was available."
    return output


def validate_community_output(output: CommunityOutput) -> CommunityOutput:
    # AI may recommend participation points, but it cannot directly approve official volunteer hours.
    if output.volunteer_review_required:
        output.summary += " Official volunteer-hour credit requires human administrator approval."
    return output
