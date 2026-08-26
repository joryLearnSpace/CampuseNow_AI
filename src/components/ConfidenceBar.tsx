interface Props {
  value: number;
}

export default function ConfidenceBar({ value }: Props) {
  const color =
    value >= 80 ? "var(--success)" :
    value >= 70 ? "var(--warning)" :
    "var(--danger)";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>مستوى الثقة</span>
        <span style={{ fontSize: 15, fontWeight: 800, color }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 8, background: "var(--border)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            borderRadius: 8,
            background: color,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}
