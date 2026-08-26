import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        color: pathname === to ? "var(--primary-dark)" : "var(--text-secondary)",
        fontWeight: pathname === to ? 700 : 500,
        fontSize: 15,
        padding: "4px 2px",
        borderBottom: pathname === to ? "2px solid var(--primary-dark)" : "2px solid transparent",
        textDecoration: "none",
        transition: "color 0.15s, border-color 0.15s",
      }}
    >
      {label}
    </Link>
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,79,110,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Right: Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo.png" alt="CampusNow AI" style={{ height: 42, width: "auto" }} />
        </Link>

        {/* Center: Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {navLink("/", "الرئيسية")}
          {navLink("/volunteer", "مساهماتي")}
        </nav>

        {/* Left: Admin */}
        <Link
          to="/admin"
          style={{
            fontSize: 13,
            color: pathname === "/admin" ? "var(--primary-dark)" : "var(--text-secondary)",
            fontWeight: 600,
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: pathname === "/admin" ? "#EDF6FB" : "transparent",
            transition: "all 0.15s",
          }}
        >
          لوحة المسؤول
        </Link>
      </div>
    </header>
  );
}
