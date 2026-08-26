from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4
from supabase import create_client, Client
from app.config import settings


class SupabaseService:
    def __init__(self):
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key,
        )

    # ---------- locations / check-ins ----------

    def create_checkin(self, user_id: str, location_id: str) -> dict:
        now = datetime.now(timezone.utc)
        expires = now + timedelta(minutes=settings.checkin_ttl_minutes)
        row = {
            "id": str(uuid4()),
            "user_id": user_id,
            "location_id": location_id,
            "checked_in_at": now.isoformat(),
            "expires_at": expires.isoformat(),
            "active": True,
        }
        return self.client.table("checkins").insert(row).execute().data[0]

    def active_checkins(self, location_id: str) -> list[dict]:
        now = datetime.now(timezone.utc).isoformat()
        response = (
            self.client.table("checkins")
            .select("id,user_id,location_id,checked_in_at,expires_at")
            .eq("location_id", location_id)
            .eq("active", True)
            .gte("expires_at", now)
            .execute()
        )
        return response.data or []

    # ---------- requests ----------

    def create_request(self, *, requester_id: str, location_id: str, question: str, routing: dict) -> dict:
        row = {
            "id": str(uuid4()),
            "requester_id": requester_id,
            "location_id": location_id,
            "question": question,
            "category": routing["category"],
            "status": "waiting_for_responses" if routing["needs_live_human_input"] else "ready_for_verification",
            "routing_json": routing,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        return self.client.table("campus_requests").insert(row).execute().data[0]

    def get_request(self, request_id: str) -> dict | None:
        rows = (
            self.client.table("campus_requests")
            .select("*")
            .eq("id", request_id)
            .limit(1)
            .execute()
            .data
        )
        return rows[0] if rows else None

    def set_request_status(self, request_id: str, status: str, *, verification: dict | None = None) -> dict:
        update = {"status": status}
        if verification is not None:
            update["verification_json"] = verification
        return (
            self.client.table("campus_requests")
            .update(update)
            .eq("id", request_id)
            .execute()
            .data[0]
        )

    # ---------- community responses ----------

    def add_response(self, request_id: str, *, responder_id: str, answer: str, is_present_now: bool) -> dict:
        # Do not trust a boolean from the browser as proof of presence.
        request = self.get_request(request_id)
        if not request:
            raise ValueError("Request not found.")

        valid_presence = any(
            c["user_id"] == responder_id
            for c in self.active_checkins(request["location_id"])
        )

        row = {
            "id": str(uuid4()),
            "request_id": request_id,
            "responder_id": responder_id,
            "answer": answer,
            "presence_verified": bool(valid_presence and is_present_now),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        return self.client.table("community_responses").insert(row).execute().data[0]

    def get_responses(self, request_id: str) -> list[dict]:
        response = (
            self.client.table("community_responses")
            .select("*")
            .eq("request_id", request_id)
            .order("created_at")
            .execute()
        )
        return response.data or []

    # ---------- reputation ----------

    def get_reputation(self, user_id: str) -> dict:
        rows = (
            self.client.table("reputation")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
            .data
        )
        if rows:
            return rows[0]
        return {"user_id": user_id, "points": 0, "trust_score": 50}

    def add_points(self, user_id: str, points: int) -> dict:
        current = self.get_reputation(user_id)
        new_points = int(current.get("points", 0)) + int(points)
        # Upsert by user_id.
        row = {
            "user_id": user_id,
            "points": new_points,
            "trust_score": int(current.get("trust_score", 50)),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        return self.client.table("reputation").upsert(row, on_conflict="user_id").execute().data[0]

    # ---------- volunteer / HITL ----------

    def create_human_review(self, request_id: str, payload: dict) -> dict:
        row = {
            "id": str(uuid4()),
            "request_id": request_id,
            "review_type": "volunteer_contribution",
            "status": "pending",
            "payload_json": payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        return self.client.table("human_reviews").insert(row).execute().data[0]

    def decide_human_review(self, review_id: str, reviewer_id: str, decision: str, feedback: str) -> dict:
        update = {
            "status": decision,
            "reviewer_id": reviewer_id,
            "feedback": feedback,
            "reviewed_at": datetime.now(timezone.utc).isoformat(),
        }
        rows = (
            self.client.table("human_reviews")
            .update(update)
            .eq("id", review_id)
            .execute()
            .data
        )
        if not rows:
            raise ValueError("Human review not found.")
        return rows[0]

    # ---------- audit ----------

    def log_agent_action(self, request_id: str, agent_name: str, payload: dict) -> None:
        self.client.table("agent_logs").insert({
            "id": str(uuid4()),
            "request_id": request_id,
            "agent_name": agent_name,
            "payload_json": payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }).execute()


db = SupabaseService()
