import { useEffect, useState, useCallback } from "react";
import { getReviews, submitReviewDecision } from "../services/campusNowApi";
import type { ReviewItem } from "../types/campusNow";
import StatusBadge from "../components/StatusBadge";
import { CheckCircle, XCircle, Edit3, MapPin, Bot } from "lucide-react";

const DEMO_REVIEWS: ReviewItem[] = [
  {
    id: "rev-001", request_id: "req-001",
    user_id: "student-101", location_name: "مبنى 11 - فرع الفيصلية",
    question: "هل المبنى مزدحم الآن؟",
    confidence: 85,
    agent_recommendation: "ثقة متوسطة، يُوصى بالاعتماد مع مراعاة تحديث المعلومات.",
    status: "pending", created_at: "منذ 10 دقائق",
  },
  {
    id: "rev-002", request_id: "req-002",
    user_id: "student-102", location_name: "مبنى 1 - عمادة الدراسات العليا",
    question: "هل يوجد دور في مكتب التسجيل؟",
    confidence: 68,
    agent_recommendation: "ثقة منخفضة، يُنصح بطلب تعديل أو انتظار مساهمات إضافية.",
    status: "pending", created_at: "منذ 25 دقيقة",
  },
  {
    id: "rev-003", request_id: "req-003",
    user_id: "student-103", location_name: "فرع الشرفية",
    question: "هل كلية الطب مفتوحة اليوم؟",
    confidence: 91,
    agent_recommendation: "ثقة عالية، يُوصى بالاعتماد.",
    status: "approved", created_at: "منذ ساعة",
  },
];

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function Admin() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = `t-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => setReviews(DEMO_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  async function decide(reviewId: string, decision: "approved" | "rejected" | "revision") {
    setDeciding(reviewId);
    try {
      await submitReviewDecision(reviewId, {
        reviewer_id: "admin-demo-01",
        decision,
        feedback: "",
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: decision } : r))
      );
      const labels: Record<string, string> = {
        approved: "تم اعتماد المساهمة بنجاح",
        rejected: "تم رفض المساهمة",
        revision: "تم طلب تعديل المساهمة",
      };
      addToast(labels[decision], "success");
    } catch {
      addToast("حدث خطأ. تأكد من اتصال الخادم.", "error");
    } finally {
      setDeciding(null);
    }
  }

  const confidenceColor = (v: number) =>
    v >= 80 ? "var(--success)" : v >= 70 ? "var(--warning)" : "var(--danger)";

  const btnBase: React.CSSProperties = {
    padding: "8px 16px", borderRadius: 10, fontSize: 13,
    fontWeight: 700, fontFamily: "'Cairo', sans-serif",
    cursor: "pointer", border: "1.5px solid",
    transition: "all 0.15s",
    display: "flex", alignItems: "center", gap: 6,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--primary-dark)", marginBottom: 6 }}>
          مراجعة المساهمات
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
          القرار النهائي يعود للمسؤول البشري. توصيات الذكاء الاصطناعي استشارية فقط.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["الكل", "قيد المراجعة", "معتمدة", "مرفوضة"].map((tab) => (
          <button key={tab} style={{
            padding: "7px 16px", borderRadius: 20,
            border: "1px solid var(--border)", background: tab === "الكل" ? "var(--primary-dark)" : "var(--surface)",
            color: tab === "الكل" ? "white" : "var(--text-secondary)",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Cairo', sans-serif",
          }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>جاري التحميل...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="card" style={{ padding: 24 }}>
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 3, fontWeight: 500 }}>
                    #{rev.request_id}
                  </p>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
                    {rev.question}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                    <MapPin size={12} />
                    {rev.location_name}
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{rev.created_at}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <StatusBadge status={rev.status} size="sm" />
                  <span style={{
                    fontSize: 15, fontWeight: 800,
                    color: confidenceColor(rev.confidence),
                  }}>
                    {rev.confidence}% ثقة
                  </span>
                </div>
              </div>

              {/* AI recommendation */}
              <div style={{
                padding: "12px 14px", borderRadius: 10,
                background: "#EDF6FB", border: "1px solid var(--border)",
                marginBottom: 18,
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <Bot size={16} style={{ color: "var(--primary-dark)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 2 }}>
                    توصية الذكاء الاصطناعي
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{rev.agent_recommendation}</p>
                </div>
              </div>

              {/* Action buttons — only for pending */}
              {rev.status === "pending" && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={() => decide(rev.id, "approved")}
                    disabled={deciding === rev.id}
                    style={{
                      ...btnBase,
                      background: "#F0FDF4", color: "#22A06B",
                      borderColor: "#BBF7D0",
                    }}
                  >
                    <CheckCircle size={14} />
                    اعتماد
                  </button>
                  <button
                    onClick={() => decide(rev.id, "rejected")}
                    disabled={deciding === rev.id}
                    style={{
                      ...btnBase,
                      background: "#FEF2F2", color: "#D64545",
                      borderColor: "#FECACA",
                    }}
                  >
                    <XCircle size={14} />
                    رفض
                  </button>
                  <button
                    onClick={() => decide(rev.id, "revision")}
                    disabled={deciding === rev.id}
                    style={{
                      ...btnBase,
                      background: "var(--surface)", color: "var(--text-secondary)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Edit3 size={14} />
                    طلب تعديل
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast container */}
      <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast" style={{
            padding: "12px 20px", borderRadius: 12,
            background: t.type === "success" ? "#22A06B" : "#D64545",
            color: "white", fontWeight: 700, fontSize: 14,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            minWidth: 240,
          }}>
            {t.type === "success" ? "✓ " : "✕ "}{t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
