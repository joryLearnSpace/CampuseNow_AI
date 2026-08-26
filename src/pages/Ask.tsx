import { useState } from "react";
import type { Page, AgentStep } from "../types/campusNow";
import LoadingState from "../components/LoadingState";

interface AskProps {
  userId: string;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const LOCATIONS = [
  { id: "central-library", name: "Central Library" },
  { id: "computing-building", name: "Computing Building" },
  { id: "student-services", name: "Student Services" },
  { id: "main-cafeteria", name: "Main Cafeteria" },
  { id: "engineering-building", name: "Engineering Building" },
  { id: "sports-complex", name: "Sports Complex" },
  { id: "administration", name: "Administration Building" },
  { id: "medical-center", name: "Medical Center" },
];

const CATEGORIES = [
  { value: "place_status", label: "Place Status" },
  { value: "help", label: "Help" },
  { value: "lost_found", label: "Lost & Found" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

type SubmitState = "idle" | "processing" | "success" | "error";

export default function Ask({ userId, navigate }: AskProps) {
  const [question, setQuestion] = useState("");
  const [locationId, setLocationId] = useState("");
  const [category, setCategory] = useState("place_status");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [result, setResult] = useState<{ requestId: string; eligibleResponders: number; routingMessage: string } | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !locationId) {
      setError("Please enter your question and select a location.");
      return;
    }
    setError("");
    setSubmitState("processing");
    setAgentSteps([
      { label: "Request understood", status: "loading" },
      { label: "Relevant campus location identified", status: "pending" },
      { label: "Waiting for community responses", status: "pending" },
    ]);

    try {
      // Simulate Agent 1 — Campus Request & Routing Agent processing
      await new Promise((r) => setTimeout(r, 600));
      setAgentSteps([
        { label: "Request understood", status: "done" },
        { label: "Relevant campus location identified", status: "loading" },
        { label: "Waiting for community responses", status: "pending" },
      ]);
      await new Promise((r) => setTimeout(r, 500));
      setAgentSteps([
        { label: "Request understood", status: "done" },
        { label: "Relevant campus location identified", status: "done" },
        { label: "Waiting for community responses", status: "loading" },
      ]);

      // TODO: replace with real API call: createCampusRequest({ question, location_id: locationId, requester_id: userId, category })
      await new Promise((r) => setTimeout(r, 800));
      setAgentSteps([
        { label: "Request understood", status: "done" },
        { label: "Relevant campus location identified", status: "done" },
        { label: "Waiting for community responses", status: "done" },
      ]);
      setResult({ requestId: `req-${Date.now()}`, eligibleResponders: 12, routingMessage: "Sent to students near this location." });
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setError("Failed to submit your question. Please try again.");
    }
  }

  if (submitState === "success" && result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your question has been sent.
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-600 text-sm mb-4">
            <span>👥</span>
            <span><strong className="text-slate-800">{result.eligibleResponders} students</strong> may be able to help.</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium">
              <span className="animate-pulse">⏳</span>
              Waiting for responses...
            </div>
          </div>

          {/* Agent transparency steps */}
          <div className="text-left mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Processing Status</p>
            <div className="flex flex-col gap-2">
              {agentSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {step.status === "done" && <span className="text-green-500 flex-shrink-0">✓</span>}
                  {step.status === "loading" && <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin flex-shrink-0" />}
                  {step.status === "pending" && <span className="text-slate-400 flex-shrink-0">○</span>}
                  <span className={step.status === "done" ? "text-slate-700" : "text-slate-400"}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("request-details", { requestId: result.requestId })}
              className="flex-1 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#2a4f7c] transition-colors"
            >
              Track Responses
            </button>
            <button
              onClick={() => { setSubmitState("idle"); setQuestion(""); setLocationId(""); setResult(null); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Ask Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Ask CampusNow
        </h1>
        <p className="text-slate-500 text-sm">Ask students who are currently near this location.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Is the library crowded right now?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="">Select a campus location</option>
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c.value
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitState === "processing"}
          className="w-full py-3 rounded-xl bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitState === "processing" ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
          ) : (
            "Ask Now"
          )}
        </button>
      </form>
    </div>
  );
}
