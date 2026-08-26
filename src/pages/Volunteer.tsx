import { useEffect, useState } from "react";
import { getVolunteerProfile } from "../services/campusNowApi";
import type { VolunteerProfile } from "../types/campusNow";
import { CURRENT_USER_ID } from "../types/campusNow";
import { AlertCircle, Award, CheckCircle, Clock } from "lucide-react";

const FALLBACK: VolunteerProfile = {
  user_id: CURRENT_USER_ID,
  name: "طالب تجريبي",
  points: 287,
  trust_score: 92,
  verified_contributions: 18,
  volunteer_hours: 2.5,
  volunteer_status: "pending",
  recent_contributions: [
    { id: "c1", location: "مبنى 11 - فرع الفيصلية", description: "أفاد بازدحام متوسط في الدور الثاني", points: 16, timestamp: "منذ 15 دقيقة" },
    { id: "c2", location: "مكتبة الأميرة الجوهرة", description: "أكد إتاحة مقاعد في الحي الثاني", points: 14, timestamp: "منذ يوم" },
    { id: "c3", location: "مبنى 17", description: "كافيتيريا مفتوحة", points: 5, timestamp: "منذ يومين" },
  ],
};

export default function Volunteer() {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolunteerProfile(CURRENT_USER_ID)
      .then(setProfile)
      .catch(() => setProfile(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const data = profile ?? FALLBACK;

  const statCard = (label: string, value: string | number, icon: React.ReactNode, color: string) => (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EDF6FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 800, color }}>{value}</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--primary-dark)", marginBottom: 6 }}>مساهماتي</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>تابع مساهماتك في مساعدة مجتمع الجامعة.</p>
      </div>

      {/* Student ID badge */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #004F6E, #83CCEA)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>ط</span>
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>{data.name}</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{data.user_id}</p>
        </div>
        <div style={{ marginRight: "auto" }}>
          <span style={{
            background: "#F0FDF4", color: "#22A06B",
            padding: "5px 14px", borderRadius: 20,
            fontSize: 12, fontWeight: 700,
            border: "1px solid #BBF7D0",
          }}>
            ✓ عضو نشيط
          </span>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>جاري التحميل...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {statCard("نقاط المجتمع", data.points, <Award size={20} style={{ color: "var(--primary-dark)" }} />, "var(--primary-dark)")}
            {statCard("مستوى الثقة", `${data.trust_score}%`, <CheckCircle size={20} style={{ color: "var(--success)" }} />, "var(--success)")}
            {statCard("المساهمات الموثقة", data.verified_contributions, <Award size={20} style={{ color: "#D99A25" }} />, "#D99A25")}
          </div>

          {/* Volunteer hours card */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={20} style={{ color: "var(--primary-dark)" }} />
                <p style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>الساعات التطوعية</p>
              </div>
              <span style={{
                background: "#FFFBEB", color: "#D99A25",
                padding: "5px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 700,
                border: "1px solid #FDE68A",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D99A25", display: "inline-block" }} />
                قيد المراجعة
              </span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 800, color: "var(--primary-dark)", marginBottom: 4 }}>
              {data.volunteer_hours ?? 0} ساعة
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>ساعات مؤهلة تحت المراجعة البشرية</p>
          </div>

          {/* Notice */}
          <div style={{
            padding: "14px 18px", borderRadius: 12,
            background: "#EDF6FB", border: "1px solid var(--primary-light)",
            display: "flex", alignItems: "flex-start", gap: 12,
            marginBottom: 28,
          }}>
            <AlertCircle size={18} style={{ color: "var(--primary-dark)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: "var(--primary-dark)", lineHeight: 1.8, fontWeight: 500 }}>
              <strong>ملاحظة مهمة:</strong> الساعات التطوعية الرسمية لا يعتمدها الذكاء الاصطناعي تلقائيًا، وإنما تحتاج مراجعة مسؤول بشري قبل الاعتماد الرسمي.
            </p>
          </div>

          {/* Recent contributions */}
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 14 }}>
            أحدث المساهمات
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.recent_contributions.map((c) => (
              <div key={c.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#EDF6FB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--primary-dark)" }}>+{c.points}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{c.description}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{c.location}</p>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", flexShrink: 0 }}>{c.timestamp}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
