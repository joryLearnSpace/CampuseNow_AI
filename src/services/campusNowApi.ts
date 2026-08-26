import type {
  CheckIn,
  CampusRequest,
  CommunityResponse,
  LostFoundItem,
  HumanReview,
} from "../types/campusNow";

const API_BASE = import.meta.env.VITE_CAMPUSNOW_API ?? "http://localhost:8000/api";

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

// Auth — stub, ready for Supabase Auth integration
export async function signIn(email: string, password: string) {
  // TODO: replace with Supabase Auth signInWithPassword
  return apiFetch<{ token: string; userId: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut() {
  // TODO: replace with Supabase Auth signOut
  return apiFetch("/auth/logout", { method: "POST" });
}

// Check-ins
export async function createCheckIn(locationId: string, userId: string) {
  return apiFetch<CheckIn>("/checkins", {
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
  return apiFetch<{ requestId: string; status: string; eligibleResponders: number; routingMessage: string }>("/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCampusRequest(requestId: string) {
  return apiFetch<CampusRequest>(`/requests/${requestId}`);
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
  return apiFetch<{ success: boolean; presenceVerified: boolean }>(`/requests/${requestId}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Verification — triggers Agent 2 (Trust & Verification) + Agent 3 (Community & Volunteer)
export async function verifyCampusRequest(requestId: string) {
  return apiFetch<{ verifiedAnswer: string; confidence: number; supportingCount: number; status: string }>(`/requests/${requestId}/verify`, {
    method: "POST",
  });
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
