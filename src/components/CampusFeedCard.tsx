import ConfidenceBadge from "./ConfidenceBadge";
import StatusBadge from "./StatusBadge";

interface CampusFeedCardProps {
  locationName: string;
  question: string;
  category: string;
  status: "verified" | "waiting" | "pending" | "low_confidence" | "closed";
  responseCount?: number;
  confidence?: number;
  verifiedAnswer?: string;
  timeAgo: string;
  onClick?: () => void;
}

const categoryIcon: Record<string, string> = {
  place_status: "📍",
  help: "🤝",
  lost_found: "🔍",
  event: "📅",
  other: "💬",
};

export default function CampusFeedCard({
  locationName,
  question,
  category,
  status,
  responseCount,
  confidence,
  verifiedAnswer,
  timeAgo,
  onClick,
}: CampusFeedCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all duration-150"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{categoryIcon[category] ?? "💬"}</span>
        <span className="text-xs font-medium text-slate-500">{locationName}</span>
        <StatusBadge status={status} size="sm" />
        <span className="ml-auto text-xs text-slate-400">{timeAgo}</span>
      </div>
      <p className="font-semibold text-slate-800 text-sm leading-snug mb-2">{question}</p>
      {verifiedAnswer && (
        <p className="text-sm text-slate-600 mb-2 leading-relaxed">{verifiedAnswer}</p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        {confidence !== undefined && <ConfidenceBadge confidence={confidence} />}
        {responseCount !== undefined && (
          <span className="text-xs text-slate-500">{responseCount} response{responseCount !== 1 ? "s" : ""}</span>
        )}
      </div>
    </button>
  );
}
