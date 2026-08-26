import { useState } from "react";
import type { Page, User } from "../types/campusNow";

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  user: User | null;
  onSignOut: () => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⊞" },
  { id: "campus", label: "Campus", icon: "🏛" },
  { id: "ask", label: "Ask", icon: "❓" },
  { id: "lost-found", label: "Lost & Found", icon: "🔍" },
  { id: "volunteer", label: "Volunteer", icon: "🤝" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export default function Navbar({ currentPage, navigate, user, onSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-[#1e3a5f] shadow-md sticky top-0 z-40">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-white font-bold text-lg tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">CN</span>
          CampusNow AI
        </button>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
          {user?.isAdmin && (
            <button
              onClick={() => navigate("admin")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === "admin" ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Admin
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-400 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notifications</p>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800">New response to your question</p>
                  <p className="text-xs text-slate-500 mt-0.5">Central Library · 2 min ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">Your check-in has been recorded</p>
                  <p className="text-xs text-slate-500 mt-0.5">Computing Building · 10 min ago</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("profile")}
            className="w-9 h-9 rounded-full bg-blue-400 text-white text-sm font-semibold flex items-center justify-center hover:bg-blue-300 transition-colors"
          >
            {user?.name?.charAt(0) ?? "S"}
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1e3a5f] shadow-md sticky top-0 z-40">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-white font-bold text-base"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">CN</span>
          CampusNow
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="w-64 bg-white h-full shadow-xl flex flex-col py-6 px-4 gap-1">
            <div className="flex items-center gap-2 px-2 mb-4">
              <span className="bg-[#1e3a5f] text-white text-xs font-bold px-2 py-1 rounded">CN</span>
              <span className="font-bold text-[#1e3a5f]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CampusNow AI</span>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(item.id); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {user?.isAdmin && (
              <button
                onClick={() => { navigate("admin"); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === "admin" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>⚙️</span> Admin
              </button>
            )}
            <div className="mt-auto">
              <button
                onClick={() => { onSignOut(); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-stretch">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              currentPage === item.id ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
