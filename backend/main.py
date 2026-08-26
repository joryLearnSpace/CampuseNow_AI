# ============================================================
# CampusNow AI - FastAPI Application
# ============================================================

import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .multi_agent import (
    AGENT_LOGS,
    CAMPUS,
    HUMAN_REVIEWS,
    REPUTATION,
    AskInput,
    ReviewDecision,
    run_campusnow,
)


# ============================================================
# FastAPI and CORS
# ============================================================

app = FastAPI(
    title="CampusNow AI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*-\d+\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API Endpoints
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "project": "CampusNow AI",
        "agents": 3,
    }


@app.get("/api/campus")
def get_campus():
    return {
        "campuses": [
            {
                "id": campus_id,
                "name": data["name"],
                "locations": [
                    {"id": location_id, "name": location_name}
                    for location_id, location_name in data["locations"].items()
                ],
            }
            for campus_id, data in CAMPUS.items()
        ]
    }


@app.post("/api/ask")
def ask(payload: AskInput):
    try:
        return run_campusnow(
            question=payload.question,
            campus_id=payload.campus_id,
            location_id=payload.location_id,
            requester_id=payload.requester_id,
        ).model_dump(mode="json")
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        print("Internal error:", error)
        raise HTTPException(
            status_code=500,
            detail="حدث خطأ أثناء تشغيل نظام الوكلاء.",
        ) from error


@app.get("/api/volunteer/{user_id}")
def volunteer(user_id: str):
    profile = REPUTATION.get(
        user_id,
        {"points": 0, "trust_score": 50, "verified_contributions": 0},
    )
    return {
        "user_id": user_id,
        "name": "طالب تجريبي",
        **profile,
        "recent_contributions": [],
        "official_hours": None,
        "status": "pending_review",
        "note": "الساعات التطوعية الرسمية تحتاج مراجعة بشرية.",
    }


@app.get("/api/reviews")
def reviews():
    return list(HUMAN_REVIEWS.values())


@app.post("/api/reviews/{review_id}/decision")
def review_decision(review_id: str, payload: ReviewDecision):
    if review_id not in HUMAN_REVIEWS:
        raise HTTPException(status_code=404, detail="Review not found.")

    HUMAN_REVIEWS[review_id].update(
        {
            "status": payload.decision,
            "reviewer_id": payload.reviewer_id,
            "feedback": payload.feedback,
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return HUMAN_REVIEWS[review_id]


@app.get("/api/logs")
def logs():
    return AGENT_LOGS
