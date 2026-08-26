import AskCard from "../components/AskCard";
import LocationCard from "../components/LocationCard";
import StatusBadge from "../components/StatusBadge";
import { DEMO_LOST_ITEMS, DEMO_LIVE_LOCATIONS } from "../types/campusNow";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #004F6E 0%, #267C9B 55%, #83CCEA 100%)",
        padding: "56px 24px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{ maxWidth: 760, width: "100%", textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800, color: "white",
            marginBottom: 12, lineHeight: 1.3,
          }}>
            اسأل.. واعرف الآن
          </h1>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.85)",
            maxWidth: 540, margin: "0 auto 36px",
            lineHeight: 1.8, fontWeight: 500,
          }}>
            اسأل عن أي موقع في جامعة جدة واعرف آخر المعلومات المتاحة من مجتمع الجامعة.
          </p>
        </div>

        {/* Ask Card — overlapping the hero bottom */}
        <div style={{ maxWidth: 760, width: "100%", marginBottom: -24, position: "relative", zIndex: 10 }}>
          <AskCard />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 48px" }}>

        {/* Live campus section */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                ماذا يحدث في الجامعة الآن؟
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>تحديثات حية من مجتمع جامعة جدة</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {DEMO_LIVE_LOCATIONS.map((loc) => (
              <LocationCard key={loc.id} name={loc.name} sub={loc.sub} updates={loc.updates} badge={loc.badge} />
            ))}
          </div>
        </section>

        {/* Lost & Found */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                المفقودات مؤخراً
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>أشياء مفقودة أو موجودة داخل الحرم الجامعي</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {DEMO_LOST_ITEMS.map((item) => (
              <div key={item.id} className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)" }}>{item.name}</p>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 13 }}>
                  <MapPin size={13} style={{ color: "var(--primary-light)" }} />
                  {item.location}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
