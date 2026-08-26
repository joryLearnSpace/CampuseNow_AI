import type { AskPayload, AskResponse, VolunteerProfile, ReviewItem, ReviewDecision } from "../types/campusNow";

const API_BASE = import.meta.env.VITE_API_URL ?? (
  window.location.hostname.endsWith(".app.github.dev")
    ? `https://${window.location.hostname.replace(/-\d+\.app\.github\.dev$/, "-8000.app.github.dev")}/api`
    : "http://localhost:8000/api"
);

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function askCampusNow(payload: AskPayload): Promise<AskResponse> {
  return apiFetch<AskResponse>("/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getVolunteerProfile(userId: string): Promise<VolunteerProfile> {
  return apiFetch<VolunteerProfile>(`/volunteer/${userId}`);
}

export async function getReviews(): Promise<ReviewItem[]> {
  return apiFetch<ReviewItem[]>("/reviews");
}

export async function submitReviewDecision(reviewId: string, decision: ReviewDecision): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/reviews/${reviewId}/decision`, {
    method: "POST",
    body: JSON.stringify(decision),
  });
}
