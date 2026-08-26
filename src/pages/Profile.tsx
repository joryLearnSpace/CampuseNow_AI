import { useState } from "react";
import type { User } from "../types/campusNow";

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onSignOut: () => void;
}

export default function Profile({ user, onUpdate, onSignOut }: ProfileProps) {
  const [locationPrivacy, setLocationPrivacy] = useState(user.locationPrivacy);

  function togglePrivacy() {
    const updated = { ...user, locationPrivacy: !locationPrivacy };
    setLocationPrivacy(!locationPrivacy);
    onUpdate(updated);
  }

  const recentActivity = [
    { text: "Verified library crowd status", time: "Today, 11:20 AM", points: "+5" },
    { text: "Responded to help request at Computing Building", time: "Today, 9:45 AM", points: "+10" },
    { text: "Reported found AirPods", time: "Yesterday", points: "+15" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Profile
      </h1>

      {/* Avatar + basic info */}
      <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white mb-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-lg">{user.name}</p>
          <p className="text-white/70 text-sm">{user.email}</p>
          <p className="text-white/60 text-xs mt-1">{user.faculty}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Helper Level", value: user.helperLevel.split(" ")[0] },
          { label: "Points", value: user.communityPoints },
          { label: "Contributions", value: user.verifiedContributions },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-lg font-bold text-[#1e3a5f]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Privacy settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <p className="text-sm font-bold text-slate-800 mb-4">Location Privacy</p>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 mb-1">Allow temporary campus Check-In</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              CampusNow only uses your temporary campus zone to route relevant requests. Your exact location is never publicly displayed.
            </p>
          </div>
          <button
            onClick={togglePrivacy}
            className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative mt-0.5 ${locationPrivacy ? "bg-green-500" : "bg-slate-200"}`}
            aria-label="Toggle location privacy"
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${locationPrivacy ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <p className="text-sm font-bold text-slate-800 mb-4">Recent Activity</p>
        <div className="flex flex-col gap-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-slate-700">{a.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
              <span className="text-sm font-bold text-green-600 flex-shrink-0">{a.points}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSignOut}
        className="w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
