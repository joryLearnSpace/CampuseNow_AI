import type { User } from "../types/campusNow";

interface VolunteerProps {
  user: User;
}

const ACTIVITY_FEED = [
  { action: "Verified library status", points: 5, date: "Today, 11:20 AM" },
  { action: "Responded to help request", points: 10, date: "Today, 9:45 AM" },
  { action: "Found and reported lost item", points: 15, date: "Yesterday" },
  { action: "Confirmed cafeteria status", points: 5, date: "Yesterday" },
  { action: "Helped student navigate campus", points: 10, date: "2 days ago" },
];

export default function Volunteer({ user }: VolunteerProps) {
  const levelColors: Record<string, string> = {
    "New Helper": "bg-slate-100 text-slate-600",
    "Active Helper": "bg-blue-50 text-blue-700",
    "Trusted Helper": "bg-green-50 text-green-700",
    "Campus Champion": "bg-amber-50 text-amber-700",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Campus Helpers
        </h1>
        <p className="text-slate-500 text-sm">Help your university community and build your contribution record.</p>
      </div>

      {/* Profile stats */}
      <div className="bg-[#1e3a5f] text-white rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-lg font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-base">{user.name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              user.helperLevel === "Trusted Helper" ? "bg-green-400/20 text-green-200" : "bg-white/20 text-white/80"
            }`}>
              {user.helperLevel}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Community Points", value: user.communityPoints },
            { label: "Verified Contributions", value: user.verifiedContributions },
            { label: "Helpful Responses", value: user.helpfulResponses },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-white/60 text-xs mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer activity — clearly distinguished from official hours */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Community Points</p>
          <p className="text-3xl font-bold text-[#1e3a5f] mb-1">{user.communityPoints}</p>
          <p className="text-xs text-slate-400">Awarded automatically for verified contributions.</p>
          <div className="mt-3 text-xs text-slate-600 font-medium text-green-600">✓ Credited instantly</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Official Volunteer Hours</p>
          <p className="text-3xl font-bold text-amber-600 mb-1">2h 20m</p>
          <p className="text-xs text-slate-400">Eligible activity — pending human review.</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending University Review
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official hours are NEVER automatically approved. An administrator reviews and approves all volunteer records.
          </p>
        </div>
      </div>

      {/* Progress bar to next level */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">Progress to Campus Champion</p>
          <span className="text-xs text-slate-500">240 / 500 pts</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full" style={{ width: "48%" }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">260 more points to reach Campus Champion</p>
      </div>

      {/* Activity feed */}
      <h2 className="text-base font-bold text-slate-800 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Recent Activity
      </h2>
      <div className="flex flex-col gap-2">
        {ACTIVITY_FEED.map((a, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">{a.action}</p>
              <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>
            </div>
            <span className="text-sm font-bold text-green-600">+{a.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
