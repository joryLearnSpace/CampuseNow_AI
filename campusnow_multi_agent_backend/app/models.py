from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, field_validator


class RequestCategory(str, Enum):
    PLACE_STATUS = "place_status"
    HELP = "help"
    LOST_FOUND = "lost_found"
    EVENT = "event"
    OTHER = "other"


class RequestStatus(str, Enum):
    ROUTED = "routed"
    WAITING_FOR_RESPONSES = "waiting_for_responses"
    READY_FOR_VERIFICATION = "ready_for_verification"
    VERIFIED = "verified"
    LOW_CONFIDENCE = "low_confidence"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CreateCampusRequest(BaseModel):
    question: str = Field(min_length=5, max_length=700)
    location_id: str = Field(min_length=1, max_length=100)
    requester_id: str = Field(min_length=1, max_length=100)


class CommunityResponseCreate(BaseModel):
    responder_id: str = Field(min_length=1, max_length=100)
    answer: str = Field(min_length=1, max_length=700)
    is_present_now: bool = True


class CheckInCreate(BaseModel):
    user_id: str = Field(min_length=1, max_length=100)
    location_id: str = Field(min_length=1, max_length=100)


# ---------------- Agent 1 structured output ----------------

class RoutingOutput(BaseModel):
    normalized_question: str = Field(min_length=5, max_length=700)
    category: RequestCategory
    location_id: str
    needs_live_human_input: bool
    preferred_source: Literal["community", "university_data", "both"]
    target_audience: str = Field(min_length=5, max_length=250)
    routing_reason: str = Field(min_length=20, max_length=500)
    risk_level: RiskLevel


# ---------------- Agent 2 structured output ----------------

class EvidenceItem(BaseModel):
    source_type: Literal["community_response", "university_record"]
    source_id: str
    statement: str = Field(min_length=1, max_length=700)
    freshness_minutes: int = Field(ge=0)
    trusted: bool = True


class VerificationOutput(BaseModel):
    answer: str = Field(min_length=10, max_length=900)
    confidence_score: int = Field(ge=0, le=100)
    evidence_used: list[str] = Field(default_factory=list)
    conflicting_evidence: bool
    sufficient_evidence: bool
    warning: str | None = Field(default=None, max_length=400)

    @field_validator("answer")
    @classmethod
    def reject_fake_certainty(cls, value: str):
        banned = {"definitely", "100% certain", "guaranteed"}
        lowered = value.lower()
        if any(term in lowered for term in banned):
            raise ValueError("Verification answer must not claim unsupported certainty.")
        return value


# ---------------- Agent 3 structured output ----------------

class ContributionDecision(BaseModel):
    responder_id: str
    eligible: bool
    points_awarded: int = Field(ge=0, le=20)
    reason: str = Field(min_length=10, max_length=350)


class CommunityOutput(BaseModel):
    contribution_decisions: list[ContributionDecision]
    volunteer_review_required: bool
    moderation_required: bool
    summary: str = Field(min_length=10, max_length=500)


# ---------------- API response models ----------------

class CreateRequestResult(BaseModel):
    request_id: str
    status: RequestStatus
    routing: RoutingOutput
    eligible_responder_count: int
    message: str


class VerifyRequestResult(BaseModel):
    request_id: str
    status: RequestStatus
    verification: VerificationOutput
    community: CommunityOutput | None = None


class HumanReviewDecision(BaseModel):
    reviewer_id: str
    decision: Literal["approved", "rejected", "revision"]
    feedback: str = Field(default="", max_length=1000)

    @field_validator("feedback")
    @classmethod
    def feedback_required_for_non_approval(cls, v: str, info):
        decision = info.data.get("decision")
        if decision in {"rejected", "revision"} and not v.strip():
            raise ValueError("Feedback is required for rejected or revision decisions.")
        return v
