import { useState } from "react";

type AdminTab = "overview" | "volunteer-reviews" | "moderation" | "agent-logs" | "locations";

const REVIEWS = [
  { id: "rev1", name: "Ahmed Al-Qahtani", faculty: "Engineering", contributions: 22, eligibleHours: "3h 10m", recommendation: "Approve — consistent verified contributions over 14 days.", status: "pending" as const },
  { id: "rev2", name: "Fatima Al-Zahrani", faculty: "Computing", contributions: 18, eligibleHours: "2h 20m", recommendation: "Approve — strong response quality, no flag.", status: "pending" as const },
  { id: "rev3", name: "Omar Al-Harbi", faculty: "Business", contributions: 8, eligibleHours: "0h 55m", recommendation: "Request revision — activity below threshold for approval.", status: "pending" as const },
];

const AGENT_LOGS = [
  { time: "11:34 AM", agent: "Agent 1", action: "Routed library status request to 14 eligible students." },
  { time: "11:30 AM", agent: "Agent 2", action: "Verified library status with 84% confidence from 6 responses." },
  { time: "11:12 AM", agent: "Agent 3", action: "Generated volunteer review recommendation for Ahmed Al-Qahtani." },
  { time: "10:58 AM", agent: "Agent 1", action: "Routed lost item report (AirPods) to Computing Building students." },
  { time: "10:45 AM", agent: "Agent 2", action: "Low confidence — insufficient responses for cafeteria status." },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [reviews, setReviews] = useState(REVIEWS);
  const [selectedReview, setSelectedReview] = useState<typeof REVIEWS[0] | null>(null);
  const [deciding, setDeciding] = useState(false);

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "volunteer-reviews", label: "Volunteer Reviews" },
    { id: "moderation", label: "Moderation" },
    { id: "agent-logs", label: "Agent Logs" },
    { id: "locations", label: "Locations" },
  ];

  async function handleDecision(reviewId: string, decision: "approved" | "rejected" | "revision_requested") {
    setDeciding(true);
    // TODO: decideHumanReview(reviewId, decision)
    await new Promise((r) => setTimeout(r, 700));
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, status: decision === "approved" ? "approved" as const : decision === "rejected" ? "rejected" as const : "pending" as const } : r));
    setSelectedReview(null);
    setDeciding(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Admin Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Requests", value: 8, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pending Reviews", value: reviews.filter((r) => r.status === "pending").length, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Active Helpers", value: 34, color: "text-green-600", bg: "bg-green-50" },
              { label: "Low Confidence", value: 2, color: "text-red-600", bg: "bg-red-50" },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                  <span className={`text-xl font-bold ${c.color}`}>{c.value}</span>
                </div>
                <p className="text-sm font-medium text-slate-700">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">Human-in-the-Loop Reminder</p>
            <p className="text-sm text-amber-700">
              Volunteer hours are NEVER automatically approved by AI. All volunteer records require administrator review before being marked as official. AI provides recommendations only.
            </p>
          </div>
        </div>
      )}

      {tab === "volunteer-reviews" && (
        <div>
          {selectedReview ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <button onClick={() => setSelectedReview(null)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to reviews
              </button>
              <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Volunteer Contribution Review
              </h2>
              <p className="text-slate-500 text-sm mb-5">{selectedReview.name} — {selectedReview.faculty}</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Contributions", value: selectedReview.contributions },
                  { label: "Eligible Activity", value: selectedReview.eligibleHours },
                  { label: "Status", value: "Pending Review" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                    <p className="font-bold text-slate-800">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-xs font-semibold text-blue-600 mb-1.5">AI Recommendation (Agent 3)</p>
                <p className="text-sm text-blue-800">{selectedReview.recommendation}</p>
                <p className="text-xs text-blue-500 mt-2">This is an AI recommendation only. The final decision rests with the administrator.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDecision(selectedReview.id, "approved")}
                  disabled={deciding}
                  className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {deciding ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleDecision(selectedReview.id, "rejected")}
                  disabled={deciding}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision(selectedReview.id, "revision_requested")}
                  disabled={deciding}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 transition-colors"
                >
                  Request Revision
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.faculty} · {r.contributions} contributions · {r.eligibleHours} eligible</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      r.status === "pending" ? "bg-amber-50 text-amber-700" :
                      r.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {r.status === "pending" ? "Pending Review" : r.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                    {r.status === "pending" && (
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="px-4 py-2 rounded-xl bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#2a4f7c] transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "agent-logs" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700">
            Agent logs show routing and verification actions only. Internal prompts and chain-of-thought are never exposed.
          </div>
          <div className="flex flex-col gap-2">
            {AGENT_LOGS.map((log, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-slate-400 tabular-nums">{log.time}</span>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{log.agent}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "moderation" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-sm py-16">
          No items requiring moderation at this time.
        </div>
      )}

      {tab === "locations" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-700 mb-4">Active Campus Locations</p>
          <div className="flex flex-col gap-2">
            {[
              { name: "Central Library", users: 18, status: "active" },
              { name: "Computing Building", users: 27, status: "active" },
              { name: "Student Services", users: 8, status: "quiet" },
              { name: "Main Cafeteria", users: 45, status: "busy" },
            ].map((l) => (
              <div key={l.name} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{l.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{l.users} users</span>
                  <span className={`w-2 h-2 rounded-full ${l.status === "active" ? "bg-green-400" : l.status === "busy" ? "bg-red-400" : "bg-amber-400"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
