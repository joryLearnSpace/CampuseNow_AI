import { useState, useRef } from "react";
import { CAMPUSES, QUICK_QUESTIONS, CURRENT_USER_ID } from "../types/campusNow";
import type { AskResponse } from "../types/campusNow";
import { askCampusNow } from "../services/campusNowApi";
import AgentLoading from "./AgentLoading";
import AnswerCard from "./AnswerCard";
import { Send } from "lucide-react";

type State = "idle" | "loading" | "done";

export default function AskCard() {
  const [question, setQuestion] = useState("");
  const [campusId, setCampusId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [state, setState] = useState<State>("idle");
  const [agentStep, setAgentStep] = useState(0);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const campus = CAMPUSES.find((c) => c.id === campusId);
  const canSubmit = question.trim().length > 0 && campusId && locationId;

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setState("loading");
    setAgentStep(0);
    setResult(null);
    setTimeout(() => setAgentStep(1), 900);
    setTimeout(() => setAgentStep(2), 1800);

    try {
      const res = await askCampusNow({
        question: question.trim(),
        campus_id: campusId,
        location_id: locationId,
        requester_id: CURRENT_USER_ID,
      });
      setResult(res);
      setState("done");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم. تأكد من تشغيل Python FastAPI.");
      setState("idle");
      setAgentStep(0);
    }
  }

  function reset() {
    setState("idle");
    setResult(null);
    setAgentStep(0);
    setError("");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid var(--border)", borderRadius: 12,
    fontSize: 14, fontFamily: "'Cairo', sans-serif",
    color: "var(--text-primary)", background: "var(--surface)",
    outline: "none", transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 700, color: "var(--text-secondary)",
    marginBottom: 6, display: "block",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Card */}
      <div className="card" style={{ padding: 28 }}>
        <form onSubmit={handleAsk} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Question */}
          <div>
            <label style={labelStyle}>سؤالك</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="مثال: هل مبنى 11 مزدحم الآن؟"
              rows={2}
              style={{
                ...inputStyle, resize: "none", lineHeight: 1.6,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary-light)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Campus + Location row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>المقر أو الفرع</label>
              <select
                value={campusId}
                onChange={(e) => { setCampusId(e.target.value); setLocationId(""); }}
                style={{ ...inputStyle }}
              >
                <option value="">اختر الفرع...</option>
                {CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>المبنى أو الموقع</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                disabled={!campusId}
                style={{
                  ...inputStyle,
                  opacity: campusId ? 1 : 0.5,
                  cursor: campusId ? "pointer" : "not-allowed",
                }}
              >
                <option value="">اختر الموقع...</option>
                {campus?.locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "#FEF2F2", border: "1px solid #FECACA",
              color: "var(--danger)", fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit || state === "loading"}
            className="btn-primary"
            style={{
              padding: "13px 28px", fontSize: 15, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {state === "loading" ? (
              <>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                جاري التحليل...
              </>
            ) : (
              <>
                <Send size={16} />
                اسأل الآن
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick questions */}
      {state === "idle" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600, marginBottom: 10 }}>
            أسئلة سريعة
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className="chip"
                onClick={() => setQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {state === "loading" && <AgentLoading step={agentStep} />}

      {/* Result */}
      {state === "done" && result && (
        <div ref={resultRef}>
          <AnswerCard result={result} question={question} onReset={reset} />
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
