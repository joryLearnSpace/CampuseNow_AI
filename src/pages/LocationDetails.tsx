import type { Page } from "../types/campusNow";
import ConfidenceBadge from "../components/ConfidenceBadge";

interface LocationDetailsProps {
  locationId: string;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const LOCATION_DATA: Record<string, {
  name: string; activeUsers: number; currentStatus: string;
  confidence: number; lastVerified: string; supportingCount: number;
  questions: { text: string; responses: number; verified: boolean; timeAgo: string }[];
}> = {
  "central-library": {
    name: "Central Library", activeUsers: 18, currentStatus: "Moderately Crowded",
    confidence: 84, lastVerified: "5 minutes ago", supportingCount: 6,
    questions: [
      { text: "Are there seats upstairs?", responses: 4, verified: true, timeAgo: "10 min ago" },
      { text: "Is the study room available?", responses: 2, verified: false, timeAgo: "18 min ago" },
      { text: "Is the library crowded right now?", responses: 6, verified: true, timeAgo: "12 min ago" },
    ],
  },
  "computing-building": {
    name: "Computing Building", activeUsers: 27, currentStatus: "Busy",
    confidence: 91, lastVerified: "2 minutes ago", supportingCount: 9,
    questions: [
      { text: "Is Lab 204 open?", responses: 3, verified: true, timeAgo: "5 min ago" },
      { text: "Any computers available?", responses: 5, verified: true, timeAgo: "8 min ago" },
    ],
  },
  "student-services": {
    name: "Student Services", activeUsers: 8, currentStatus: "Quiet",
    confidence: 70, lastVerified: "12 minutes ago", supportingCount: 3,
    questions: [
      { text: "Is the service desk open?", responses: 2, verified: false, timeAgo: "18 min ago" },
    ],
  },
};

const DEFAULT_LOCATION = {
  name: "Campus Location", activeUsers: 10, currentStatus: "Unknown",
  confidence: 0, lastVerified: "Unknown", supportingCount: 0, questions: [],
};

export default function LocationDetails({ locationId, navigate }: LocationDetailsProps) {
  const loc = LOCATION_DATA[locationId] ?? DEFAULT_LOCATION;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button
        onClick={() => navigate("campus")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Campus
      </button>

      {/* Header */}
      <div className="bg-[#1e3a5f] text-white rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-2 text-white/70 text-sm">
          <span>📍</span>
          <span>{loc.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="font-semibold text-lg">{loc.activeUsers} active users</span>
        </div>
        <p className="text-white/60 text-xs mt-1">Last verified update: {loc.lastVerified}</p>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Current Status</p>
        <p className="text-xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {loc.currentStatus}
        </p>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Confidence</span>
            <span className="text-sm font-semibold text-slate-700">{loc.confidence}%</span>
          </div>
          <ConfidenceBadge confidence={loc.confidence} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Supporting confirmations</span>
          <span className="font-semibold text-slate-700">{loc.supportingCount} students</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Ask Here", icon: "❓", page: "ask" as Page },
          { label: "Confirm Status", icon: "✓", action: () => {} },
          { label: "Request Help", icon: "🤝", page: "ask" as Page },
          { label: "Report Lost Item", icon: "🔍", page: "lost-found" as Page },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => a.page ? navigate(a.page) : a.action?.()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <span>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* Recent questions */}
      <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Recent Questions
      </h2>
      <div className="flex flex-col gap-3">
        {loc.questions.map((q, i) => (
          <button
            key={i}
            onClick={() => navigate("request-details", { requestId: `r${i + 1}` })}
            className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <p className="font-semibold text-slate-800 text-sm mb-2">{q.text}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-500">{q.responses} responses</span>
              {q.verified ? (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span>✓</span> Verified
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-medium">Waiting for confirmation</span>
              )}
              <span className="text-xs text-slate-400 ml-auto">{q.timeAgo}</span>
            </div>
          </button>
        ))}
        {loc.questions.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">No recent questions for this location.</div>
        )}
      </div>
    </div>
  );
}
