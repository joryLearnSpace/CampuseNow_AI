import { useState } from "react";
import type { Page } from "../types/campusNow";
import LocationCard from "../components/LocationCard";

interface CampusProps {
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const LOCATIONS = [
  { id: "central-library", name: "Central Library", activeUsers: 18, lastUpdated: "5 min ago", recentUpdates: 3, status: "active" as const },
  { id: "computing-building", name: "Computing Building", activeUsers: 27, lastUpdated: "2 min ago", recentUpdates: 6, status: "active" as const },
  { id: "student-services", name: "Student Services", activeUsers: 8, lastUpdated: "12 min ago", recentUpdates: 1, status: "quiet" as const },
  { id: "main-cafeteria", name: "Main Cafeteria", activeUsers: 45, lastUpdated: "1 min ago", recentUpdates: 9, status: "busy" as const },
  { id: "engineering-building", name: "Engineering Building", activeUsers: 14, lastUpdated: "8 min ago", recentUpdates: 2, status: "active" as const },
  { id: "sports-complex", name: "Sports Complex", activeUsers: 6, lastUpdated: "20 min ago", recentUpdates: 0, status: "quiet" as const },
  { id: "administration", name: "Administration Building", activeUsers: 3, lastUpdated: "35 min ago", recentUpdates: 0, status: "quiet" as const },
  { id: "medical-center", name: "Medical Center", activeUsers: 11, lastUpdated: "4 min ago", recentUpdates: 1, status: "active" as const },
];

export default function Campus({ navigate }: CampusProps) {
  const [search, setSearch] = useState("");

  const filtered = LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Explore Campus
        </h1>
        <p className="text-slate-500 text-sm">Live aggregated activity — individual locations are never shown.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search buildings or locations..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Active Locations", value: LOCATIONS.filter((l) => l.status === "active").length },
          { label: "Total Active Users", value: LOCATIONS.reduce((s, l) => s + l.activeUsers, 0) },
          { label: "Recent Updates", value: LOCATIONS.reduce((s, l) => s + l.recentUpdates, 0) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-center">
            <p className="text-xl font-bold text-[#1e3a5f]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No locations match your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((loc) => (
            <LocationCard
              key={loc.id}
              {...loc}
              onView={(id) => navigate("location-details", { locationId: id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
