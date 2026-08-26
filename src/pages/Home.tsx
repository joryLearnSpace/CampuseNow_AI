import { useState } from "react";
import type { User, Page } from "../types/campusNow";
import CampusFeedCard from "../components/CampusFeedCard";
import LoadingState from "../components/LoadingState";
import { createCheckIn } from "../services/campusNowApi";

interface HomeProps {
  user: User;
  navigate: (page: Page, params?: Record<string, string>) => void;
}

const FEED_ITEMS = [
  {
    id: "r1",
    locationName: "Central Library",
    question: "Is the library crowded right now?",
    category: "place_status",
    status: "verified" as const,
    responseCount: 6,
    confidence: 84,
    verifiedAnswer: "Moderately crowded, but seats are available upstairs.",
    timeAgo: "12 min ago",
  },
  {
    id: "r2",
    locationName: "Computing Building",
    question: "AirPods found near Lab 204",
    category: "lost_found",
    status: "open" as const,
    timeAgo: "15 min ago",
  },
  {
    id: "r3",
    locationName: "Student Services",
    question: "Can someone tell me if the service desk is open?",
    category: "help",
    status: "waiting" as const,
    responseCount: 2,
    timeAgo: "18 min ago",
  },
  {
    id: "r4",
    locationName: "Central Library",
    question: "Is the computer lab on floor 2 available?",
    category: "place_status",
    status: "verified" as const,
    confidence: 91,
    verifiedAnswer: "Yes, the lab is open and has available stations.",
    responseCount: 4,
    timeAgo: "25 min ago",
  },
];

const FILTERS = ["All", "Questions", "Help", "Lost & Found", "Events"] as const;

export default function Home({ user, navigate }: HomeProps) {
  const [checkInStatus, setCheckInStatus] = useState<"checked_in" | "not_checked_in">("checked_in");
  const [checkInLocation, setCheckInLocation] = useState("Computing Building");
  const [checkingIn, setCheckingIn] = useState(false);
  const [filter, setFilter] = useState("All");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  async function handleCheckIn() {
    setCheckingIn(true);
    try {
      await createCheckIn(user.id, "computing-building");
      setCheckInStatus("checked_in");
      setCheckInLocation("Computing Building");
    } finally {
      setCheckingIn(false);
    }
  }

  const quickActions = [
    { label: "Ask Here", icon: "❓", desc: "Ask students nearby", page: "ask" as Page },
    { label: "Need Help", icon: "🤝", desc: "Request assistance", page: "ask" as Page },
    { label: "Lost & Found", icon: "🔍", desc: "Report or find items", page: "lost-found" as Page },
    { label: "What's Happening", icon: "📍", desc: "Campus live feed", page: "campus" as Page },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-500 text-sm font-medium">{greeting()},</p>
        <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {user.name.split(" ")[0]} 👋
        </h1>
      </div>

      {/* Check-in card */}
      <div className="bg-[#1e3a5f] rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">📍</span>
              <span className="font-semibold text-base">{checkInLocation}</span>
            </div>
            {checkInStatus === "checked_in" ? (
              <div className="flex items-center gap-1.5 text-green-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Checked in
              </div>
            ) : (
              <span className="text-white/60 text-sm">Not checked in</span>
            )}
          </div>
          <button
            onClick={checkInStatus === "checked_in" ? () => navigate("campus") : handleCheckIn}
            disabled={checkingIn}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-60"
          >
            {checkingIn ? "Checking in..." : checkInStatus === "checked_in" ? "Change Location" : "Check In"}
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.page)}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-blue-200 transition-all text-center"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-semibold text-slate-800">{a.label}</span>
            <span className="text-xs text-slate-500 leading-tight hidden sm:block">{a.desc}</span>
          </button>
        ))}
      </div>

      {/* Live feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Happening Now
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {FEED_ITEMS.filter((item) => {
            if (filter === "All") return true;
            if (filter === "Questions") return item.category === "place_status";
            if (filter === "Help") return item.category === "help";
            if (filter === "Lost & Found") return item.category === "lost_found";
            if (filter === "Events") return item.category === "event";
            return true;
          }).map((item) => (
            <CampusFeedCard
              key={item.id}
              locationName={item.locationName}
              question={item.question}
              category={item.category}
              status={item.status as "verified" | "waiting" | "pending" | "low_confidence" | "closed"}
              responseCount={item.responseCount}
              confidence={item.confidence}
              verifiedAnswer={item.verifiedAnswer}
              timeAgo={item.timeAgo}
              onClick={() => navigate("request-details", { requestId: item.id })}
            />
          ))}
          {FEED_ITEMS.filter((item) => {
            if (filter === "All") return true;
            if (filter === "Questions") return item.category === "place_status";
            if (filter === "Help") return item.category === "help";
            if (filter === "Lost & Found") return item.category === "lost_found";
            if (filter === "Events") return item.category === "event";
            return true;
          }).length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No posts in this category yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
