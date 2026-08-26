import { useState } from "react";
import type { Page } from "../types/campusNow";
import ConfidenceBadge from "../components/ConfidenceBadge";
import LoadingState from "../components/LoadingState";

interface RequestDetailsProps {
  requestId: string;
  userId: string;
  navigate: (page: Page) => void;
}

type VerifyState = "idle" | "verifying" | "verified" | "low_confidence";

export default function RequestDetails({ requestId, userId, navigate }: RequestDetailsProps) {
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [presenceVerified, setPresenceVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [quickAnswer, setQuickAnswer] = useState("");

  const mockRequest = {
    locationName: "Central Library",
    question: "Is the library crowded right now?",
    status: "waiting",
    responseCount: 3,
    eligibleResponders: 12,
  };

  async function handleSubmitResponse(e: React.FormEvent) {
    e.preventDefault();
    const finalAnswer = quickAnswer || response;
    if (!finalAnswer) return;
    setSubmitting(true);
    try {
      // TODO: submitCommunityResponse(requestId, { responder_id: userId, answer: finalAnswer, is_present_now: true })
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      setPresenceVerified(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify() {
    setVerifyState("verifying");
    try {
      // TODO: verifyCampusRequest(requestId) — triggers Agent 2 + Agent 3
      await new Promise((r) => setTimeout(r, 2000));
      setVerifyState("verified");
    } catch {
      setVerifyState("low_confidence");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <button
        onClick={() => navigate("home")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <span>📍</span>
          <span>{mockRequest.locationName}</span>
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {mockRequest.question}
        </h2>
        <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
          <span>{mockRequest.responseCount} responses so far</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="animate-pulse">⏳</span>
            Waiting for responses...
          </span>
        </div>
      </div>

      {/* Response form — for students checked in nearby */}
      {!submitted ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-semibold text-blue-800 mb-1">Someone needs help nearby</p>
          <p className="text-xs text-blue-600 mb-4">You are checked in at {mockRequest.locationName}. Your presence will be verified by the backend.</p>

          {/* Quick response buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["Not Crowded", "Moderate", "Very Crowded"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setQuickAnswer(opt)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  quickAnswer === opt
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmitResponse} className="flex flex-col gap-3">
            <textarea
              value={response}
              onChange={(e) => { setResponse(e.target.value); setQuickAnswer(""); }}
              placeholder="Write a more detailed response..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={submitting || (!response && !quickAnswer)}
              className="w-full py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#2a4f7c] transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Response"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
            <span>✓</span> Response submitted
          </div>
          {presenceVerified && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <span>✓</span> Presence verified by backend
            </div>
          )}
        </div>
      )}

      {/* Verification section */}
      {verifyState === "idle" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-600 mb-4">Ready to request a community-verified answer?</p>
          <button
            onClick={handleVerify}
            className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Request Verification
          </button>
        </div>
      )}

      {verifyState === "verifying" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Agent Verification</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Responses received", done: true },
              { label: "Information verified by Agent 2", done: false, loading: true },
              { label: "Community evaluation by Agent 3", done: false },
              { label: "Result ready", done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {step.done ? (
                  <span className="text-green-500 flex-shrink-0">✓</span>
                ) : step.loading ? (
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin flex-shrink-0" />
                ) : (
                  <span className="text-slate-300 flex-shrink-0">○</span>
                )}
                <span className={step.done ? "text-slate-700" : step.loading ? "text-slate-600" : "text-slate-400"}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Verifying community information...</p>
        </div>
      )}

      {verifyState === "verified" && (
        <div className="bg-white rounded-2xl border border-green-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Verified Answer</p>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              ✓ Community Verified
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>📍</span>
            <span>{mockRequest.locationName}</span>
          </div>
          <p className="font-semibold text-slate-800 mb-4 leading-relaxed">
            The library appears moderately crowded, but several seats are available upstairs.
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Confidence</span>
            </div>
            <ConfidenceBadge confidence={84} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Supporting responses</span>
            <span className="font-semibold text-slate-700">6 students</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-slate-500">Last updated</span>
            <span className="text-slate-600">3 minutes ago</span>
          </div>
        </div>
      )}

      {verifyState === "low_confidence" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
            <span>⚠️</span> Not enough information yet
          </div>
          <p className="text-sm text-amber-600 mb-4">
            We don't have enough recent reliable responses to confirm the current status.
          </p>
          <button
            onClick={() => setVerifyState("idle")}
            className="w-full py-2.5 rounded-xl border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            Check Again
          </button>
        </div>
      )}
    </div>
  );
}
