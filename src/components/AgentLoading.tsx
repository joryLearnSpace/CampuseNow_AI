interface Props {
  step: number; // 0=routing, 1=verifying, 2=done
}

const STEPS = [
  "فهم الطلب",
  "التحقق من المعلومات",
  "إعداد النتيجة",
];

export default function AgentLoading({ step }: Props) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <p style={{ fontWeight: 700, fontSize: 16, color: "var(--primary-dark)", marginBottom: 20 }}>
        جاري تحليل سؤالك...
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? "var(--success)" : active ? "var(--primary-dark)" : "var(--border)",
                color: done || active ? "white" : "var(--text-secondary)",
                fontSize: 13, fontWeight: 700,
                transition: "background 0.3s",
              }}>
                {done ? "✓" : active ? <span className="dot-pulse">●</span> : "○"}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: done ? "var(--text-secondary)" : active ? "var(--primary-dark)" : "var(--text-secondary)",
                opacity: i > step ? 0.5 : 1,
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
