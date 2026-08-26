interface LocationCardProps {
  id: string;
  name: string;
  activeUsers: number;
  lastUpdated: string;
  recentUpdates?: number;
  status: "active" | "quiet" | "busy";
  onView: (id: string) => void;
}

const statusDot: Record<string, string> = {
  active: "bg-green-500",
  quiet: "bg-amber-400",
  busy: "bg-red-400",
};

export default function LocationCard({ id, name, activeUsers, lastUpdated, recentUpdates, status, onView }: LocationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800 text-base">{name}</h3>
        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${statusDot[status]}`} />
      </div>
      <div className="flex items-center gap-1.5 text-sm text-slate-600">
        <span className={`w-2 h-2 rounded-full ${statusDot[status]}`} />
        <span className="font-medium">{activeUsers} active users</span>
      </div>
      {recentUpdates !== undefined && recentUpdates > 0 && (
        <p className="text-xs text-slate-500">{recentUpdates} recent updates</p>
      )}
      <p className="text-xs text-slate-400">Last update: {lastUpdated}</p>
      <button
        onClick={() => onView(id)}
        className="mt-1 w-full py-2 rounded-lg text-sm font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 transition-colors"
      >
        View Location
      </button>
    </div>
  );
}
