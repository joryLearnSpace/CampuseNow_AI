import { Activity } from "lucide-react";

interface Props {
  name: string;
  sub: string;
  updates: number;
  badge: string;
}

export default function LocationCard({ name, sub, updates, badge }: Props) {
  const badgeColor = badge === "نشط" ? { bg: "#F0FDF4", color: "#22A06B" }
    : badge === "هادئ" ? { bg: "#F1F5F9", color: "#6E7B80" }
    : { bg: "#EDF6FB", color: "#004F6E" };

  return (
    <div className="card" style={{ padding: 20, cursor: "pointer", transition: "box-shadow 0.15s" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,79,110,0.12)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 6px rgba(0,79,110,0.06)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)", marginBottom: 2 }}>{name}</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{sub}</p>
        </div>
        <span style={{
          padding: "4px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 700,
          background: badgeColor.bg, color: badgeColor.color,
        }}>
          {badge}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 12 }}>
        <Activity size={13} style={{ color: "var(--primary-light)" }} />
        {updates} تحديث{updates > 1 ? "" : ""} حديث
      </div>
    </div>
  );
}
