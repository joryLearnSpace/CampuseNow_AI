import { useState } from "react";
import type { AskResponse } from "../types/campusNow";
import ConfidenceBar from "./ConfidenceBar";
import { MapPin, Users, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface Props {
  result: AskResponse;
  question: string;
  onReset: () => void;
}

export default function AnswerCard({ result, question, onReset }: Props) {
  const [showSources, setShowSources] = useState(false);
  const { status, routing, verification } = result;
  const isVerified = status === "verified";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Question echo */}
      <div style={{
        background: "#EDF6FB",
        borderRadius: 12,
        padding: "10px 16px",
        fontSize: 13,
        color: "var(--primary-dark)",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <MapPin size={14} />
        <span>{routing.location_name}</span>
        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>·</span>
        <span style={{ color: "var(--text-secondary)", fontWeight: 400, flex: 1 }}>{question}</span>
        <button
          onClick={onReset}
          style={{ fontSize: 12, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          سؤال جديد
        </button>
      </div>

      {isVerified ? (
        <div className="card" style={{ padding: 28 }}>
          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#F0FDF4", color: "#22A06B",
              padding: "5px 14px", borderRadius: 20,
              fontSize: 13, fontWeight: 700,
              border: "1px solid #BBF7D0",
            }}>
              ✓ نتيجة موثقة
            </span>
          </div>

          {/* Answer */}
          <p style={{
            fontSize: 18, fontWeight: 700, lineHeight: 1.7,
            color: "var(--text-primary)", marginBottom: 24,
          }}>
            {verification.answer}
          </p>

          {/* 3 Mini Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <MiniCard label="مستوى الثقة" value={`${verification.confidence}%`}
              color={verification.confidence >= 80 ? "var(--success)" : "var(--warning)"} />
            <MiniCard label="المصادر" value={`${verification.evidence_used.length} مصادر`} icon={<Users size={14} />} />
            <MiniCard label="الموقع" value={routing.location_name} small />
          </div>

          <ConfidenceBar value={verification.confidence} />

          {/* Accordion */}
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => setShowSources(!showSources)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
                padding: "8px 0",
              }}
            >
              {showSources ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              كيف تم التحقق؟
            </button>
            {showSources && (
              <div style={{
                marginTop: 8, padding: "14px 16px",
                background: "var(--background)", borderRadius: 10,
                fontSize: 13, color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}>
                <p>• {verification.evidence_used.length} مساهمات حديثة تم تحليلها.</p>
                <p>• تم التحقق من حداثة المعلومات وموثوقية المساهمات.</p>
                <p>• لا يتم الكشف عن هوية أي طالب.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 28, borderColor: "#FDE68A", background: "#FFFBEB" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <AlertTriangle size={24} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#92400E", marginBottom: 8 }}>
                المعلومات غير كافية حتى الآن
              </p>
              <p style={{ fontSize: 14, color: "#92400E", lineHeight: 1.7 }}>
                {verification.warning ?? "لا تتوفر معلومات موثوقة كافية للإجابة على سؤالك حالياً. حاول مرة أخرى لاحقاً."}
              </p>
              <button
                onClick={onReset}
                style={{
                  marginTop: 14, padding: "8px 20px", borderRadius: 10,
                  border: "1px solid #D99A25", background: "white",
                  color: "#92400E", fontWeight: 700, cursor: "pointer",
                  fontSize: 13, fontFamily: "'Cairo', sans-serif",
                }}
              >
                حاول مجدداً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniCard({ label, value, color, icon, small }: {
  label: string; value: string; color?: string; icon?: React.ReactNode; small?: boolean;
}) {
  return (
    <div style={{
      background: "var(--background)", borderRadius: 12, padding: "12px 14px",
      border: "1px solid var(--border)",
    }}>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>{label}</p>
      <p style={{
        fontSize: small ? 12 : 18, fontWeight: 800,
        color: color ?? "var(--primary-dark)",
        display: "flex", alignItems: "center", gap: 4,
        lineHeight: 1.3,
      }}>
        {icon}
        {value}
      </p>
    </div>
  );
}
