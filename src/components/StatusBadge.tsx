interface Props {
  status: "lost" | "found" | "pending" | "approved" | "rejected" | "revision_requested" | "verified" | "low_confidence" | string;
  size?: "sm" | "md";
}

const MAP: Record<string, { label: string; bg: string; color: string }> = {
  lost:               { label: "مفقود",         bg: "#FEF2F2", color: "#D64545" },
  found:              { label: "تم العثور عليه", bg: "#F0FDF4", color: "#22A06B" },
  pending:            { label: "قيد المراجعة",   bg: "#FFFBEB", color: "#D99A25" },
  approved:           { label: "معتمد",          bg: "#F0FDF4", color: "#22A06B" },
  rejected:           { label: "مرفوض",          bg: "#FEF2F2", color: "#D64545" },
  revision_requested: { label: "طلب تعديل",      bg: "#EFF6FF", color: "#2563EB" },
  verified:           { label: "موثق",           bg: "#F0FDF4", color: "#22A06B" },
  low_confidence:     { label: "ثقة منخفضة",    bg: "#FFFBEB", color: "#D99A25" },
};

export default function StatusBadge({ status, size = "md" }: Props) {
  const c = MAP[status] ?? { label: status, bg: "#F1F5F9", color: "#6E7B80" };
  const px = size === "sm" ? "8px 10px" : "6px 12px";
  const fs = size === "sm" ? 11 : 12;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: px, borderRadius: 20,
      background: c.bg, color: c.color,
      fontSize: fs, fontWeight: 700,
      fontFamily: "'Cairo', sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}
