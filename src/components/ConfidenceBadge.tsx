interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const color =
    confidence >= 75 ? "bg-green-500" :
    confidence >= 50 ? "bg-amber-400" :
    "bg-red-400";

  const textColor =
    confidence >= 75 ? "text-green-700" :
    confidence >= 50 ? "text-amber-700" :
    "text-red-700";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>{confidence}%</span>
    </div>
  );
}
