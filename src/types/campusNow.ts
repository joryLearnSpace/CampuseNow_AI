export interface User {
  id: string;
  name: string;
  email: string;
  faculty: string;
  helperLevel: "New Helper" | "Active Helper" | "Trusted Helper" | "Campus Champion";
  communityPoints: number;
  verifiedContributions: number;
  helpfulResponses: number;
  avatarUrl?: string;
  isAdmin?: boolean;
  locationPrivacy: boolean;
}

export interface Location {
  id: string;
  name: string;
  activeUsers: number;
  lastUpdated: string;
  recentUpdates: number;
  status: "active" | "quiet" | "busy";
}

export interface CampusRequest {
  id: string;
  question: string;
  locationId: string;
  locationName: string;
  requesterId: string;
  category: "place_status" | "help" | "lost_found" | "event" | "other";
  status: "pending" | "waiting" | "verified" | "low_confidence" | "closed";
  responseCount: number;
  eligibleResponders?: number;
  verifiedAnswer?: string;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityResponse {
  id: string;
  requestId: string;
  responderId: string;
  answer: string;
  isPresent: boolean;
  presenceVerified: boolean;
  createdAt: string;
}

export interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  itemName: string;
  locationId: string;
  locationName: string;
  description: string;
  reportedAt: string;
  status: "open" | "possible_match" | "resolved";
  reporterId: string;
}

export interface VolunteerActivity {
  id: string;
  userId: string;
  eligibleHours: number;
  contributionCount: number;
  status: "pending_review" | "approved" | "rejected";
  agentRecommendation?: string;
}

export interface HumanReview {
  id: string;
  userId: string;
  userName: string;
  contributionCount: number;
  eligibleHours: number;
  agentRecommendation: string;
  status: "pending" | "approved" | "rejected" | "revision_requested";
}

export interface CheckIn {
  id: string;
  userId: string;
  locationId: string;
  locationName: string;
  checkedInAt: string;
}

export type Page =
  | "login"
  | "home"
  | "campus"
  | "location-details"
  | "ask"
  | "request-details"
  | "lost-found"
  | "volunteer"
  | "profile"
  | "admin";

export interface AgentStep {
  label: string;
  status: "done" | "pending" | "loading";
}
