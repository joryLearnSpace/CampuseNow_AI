import type {
  CheckIn,
  CampusRequest,
  CommunityResponse,
  LostFoundItem,
  HumanReview,
} from "../types/campusNow";

const API_BASE = import.meta.env.VITE_CAMPUSNOW_API ?? "/api";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Check-ins
export async function createCheckIn(userId: string, locationId: string) {
  return apiFetch<{ checkin_id: string; location_id: string; expires_at: string }>("/checkins", {
    method: "POST",
    body: JSON.stringify({ location_id: locationId, user_id: userId }),
  });
}

export async function deleteCheckIn(checkInId: string) {
  return apiFetch<void>(`/checkins/${checkInId}`, { method: "DELETE" });
}

// Locations
export async function getLocations() {
  return apiFetch<{ id: string; name: string; activeUsers: number; lastUpdated: string; recentUpdates: number; status: string }[]>("/locations");
}

export async function getLocationById(locationId: string) {
  return apiFetch<{ id: string; name: string; activeUsers: number; currentStatus: string; confidence: number; lastVerified: string; supportingCount: number }>(`/locations/${locationId}`);
}

// Campus Requests — routed through Agent 1 (Campus Request & Routing Agent)
export async function createCampusRequest(payload: {
  question: string;
  location_id: string;
  requester_id: string;
  category?: string;
}) {
  const result = await apiFetch<{ request_id: string; status: string; eligible_responder_count: number; message: string }>("/requests", {
    method: "POST",
    body: JSON.stringify({
      question: payload.question,
      location_id: payload.location_id,
      requester_id: payload.requester_id,
    }),
  });
  return {
    requestId: result.request_id,
    status: result.status,
    eligibleResponders: result.eligible_responder_count,
    routingMessage: result.message,
  };
}

export async function getCampusRequest(requestId: string) {
  const result = await apiFetch<CampusRequest & { location_id: string; requester_id: string; created_at: string; updated_at?: string }>(`/requests/${requestId}`);
  return {
    ...result,
    locationId: result.locationId ?? result.location_id,
    locationName: result.locationName ?? result.location_id,
    requesterId: result.requesterId ?? result.requester_id,
    createdAt: result.createdAt ?? result.created_at,
    updatedAt: result.updatedAt ?? result.updated_at ?? result.created_at,
  };
}

export async function getCampusFeed(filter?: string) {
  const query = filter && filter !== "all" ? `?category=${filter}` : "";
  return apiFetch<CampusRequest[]>(`/requests${query}`);
}

// Community Responses
export async function submitCommunityResponse(
  requestId: string,
  payload: { responder_id: string; answer: string; is_present_now: boolean }
) {
  const result = await apiFetch<{ presence_verified: boolean }>(`/requests/${requestId}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { success: true, presenceVerified: result.presence_verified };
}

// Verification — triggers Agent 2 (Trust & Verification) + Agent 3 (Community & Volunteer)
export async function verifyCampusRequest(requestId: string) {
  const result = await apiFetch<{ status: string; verification: { answer: string; confidence_score: number; evidence_used: string[] } }>(`/requests/${requestId}/verify`, {
    method: "POST",
  });
  return {
    verifiedAnswer: result.verification.answer,
    confidence: result.verification.confidence_score,
    supportingCount: result.verification.evidence_used.length,
    status: result.status,
  };
}

// Lost & Found
export async function getLostFoundItems(type?: "lost" | "found") {
  const query = type ? `?type=${type}` : "";
  return apiFetch<LostFoundItem[]>(`/lost-found${query}`);
}

export async function reportLostFoundItem(payload: {
  type: "lost" | "found";
  item_name: string;
  location_id: string;
  description: string;
  reporter_id: string;
}) {
  return apiFetch<LostFoundItem>("/lost-found", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Volunteer / Human Reviews
export async function getHumanReviews() {
  return apiFetch<HumanReview[]>("/human-reviews");
}

export async function decideHumanReview(
  reviewId: string,
  decision: "approved" | "rejected" | "revision_requested"
) {
  return apiFetch<{ success: boolean }>(`/human-reviews/${reviewId}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision }),
  });
}

export async function getUserVolunteerActivity(userId: string) {
  return apiFetch<{ eligibleHours: number; contributionCount: number; status: string }>(`/users/${userId}/volunteer`);
}

// Community responses list
export async function getRequestResponses(requestId: string) {
  return apiFetch<CommunityResponse[]>(`/requests/${requestId}/responses`);
}
