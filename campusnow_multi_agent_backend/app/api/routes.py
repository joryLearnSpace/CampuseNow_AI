from fastapi import APIRouter, HTTPException
from app.guardrails import GuardrailViolation
from app.models import (
    CheckInCreate,
    CommunityResponseCreate,
    CreateCampusRequest,
    CreateRequestResult,
    VerifyRequestResult,
    HumanReviewDecision,
)
from app.services.supabase_service import db
from app.services.workflow import create_and_route_request, verify_and_reward


router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok", "service": "CampusNow AI Multi-Agent Backend"}


@router.post("/checkins")
def check_in(payload: CheckInCreate):
    try:
        row = db.create_checkin(payload.user_id, payload.location_id)
        return {
            "checkin_id": row["id"],
            "location_id": row["location_id"],
            "expires_at": row["expires_at"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/requests", response_model=CreateRequestResult)
def create_request(payload: CreateCampusRequest):
    try:
        return create_and_route_request(payload)
    except GuardrailViolation as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/requests/{request_id}")
def get_request(request_id: str):
    row = db.get_request(request_id)
    if not row:
        raise HTTPException(status_code=404, detail="Request not found.")
    row["responses"] = db.get_responses(request_id)
    return row


@router.post("/requests/{request_id}/responses")
def add_response(request_id: str, payload: CommunityResponseCreate):
    try:
        row = db.add_response(
            request_id,
            responder_id=payload.responder_id,
            answer=payload.answer,
            is_present_now=payload.is_present_now,
        )
        return {
            "response_id": row["id"],
            "presence_verified": row["presence_verified"],
            "message": "Response recorded.",
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/requests/{request_id}/verify", response_model=VerifyRequestResult)
def verify_request(request_id: str):
    try:
        return verify_and_reward(request_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/human-reviews/{review_id}/decision")
def decide_human_review(review_id: str, payload: HumanReviewDecision):
    try:
        return db.decide_human_review(
            review_id=review_id,
            reviewer_id=payload.reviewer_id,
            decision=payload.decision,
            feedback=payload.feedback,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
