interface StatusBadgeProps {
  status: "verified" | "waiting" | "pending" | "low_confidence" | "closed" | "active" | "quiet" | "busy" | "open" | "possible_match" | "resolved" | "pending_review" | "approved" | "rejected";
  size?: "sm" | "md";
}

const config: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  verified:       { dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700", label: "Verified" },
  active:         { dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700", label: "Active" },
  approved:       { dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700", label: "Approved" },
  open:           { dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700", label: "Open" },
  waiting:        { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-700", label: "Waiting" },
  pending:        { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  pending_review: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", label: "Pending Review" },
  quiet:          { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", label: "Quiet" },
  possible_match: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-700", label: "Possible Match" },
  low_confidence: { dot: "bg-red-400", bg: "bg-red-50", text: "text-red-700", label: "Low Confidence" },
  rejected:       { dot: "bg-red-400", bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
  closed:         { dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", label: "Closed" },
  busy:           { dot: "bg-red-400", bg: "bg-red-50", text: "text-red-700", label: "Busy" },
  resolved:       { dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", label: "Resolved" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const c = config[status] ?? config.pending;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
