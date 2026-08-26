import { useState } from "react";
import StatusBadge from "../components/StatusBadge";

const ITEMS = [
  { id: "lf1", type: "found" as const, itemName: "AirPods", locationName: "Computing Building", description: "Found near Lab 204, white case with slight scratch on lid.", reportedAt: "Today, 10:30 AM", status: "possible_match" as const },
  { id: "lf2", type: "lost" as const, itemName: "Blue Notebook", locationName: "Central Library", description: "A4 size, blue cover, has name on the inside.", reportedAt: "Today, 9:15 AM", status: "open" as const },
  { id: "lf3", type: "found" as const, itemName: "Student ID Card", locationName: "Main Cafeteria", description: "Found near seating area, belongs to Computing faculty.", reportedAt: "Yesterday, 2:00 PM", status: "possible_match" as const },
  { id: "lf4", type: "lost" as const, itemName: "Charger (MacBook)", locationName: "Engineering Building", description: "Left in room 301, USB-C charger with black cable.", reportedAt: "Yesterday, 4:45 PM", status: "open" as const },
  { id: "lf5", type: "lost" as const, itemName: "Glasses Case", locationName: "Student Services", description: "Black hard case, brand: Ray-Ban.", reportedAt: "2 days ago", status: "resolved" as const },
];

export default function LostFound() {
  const [tab, setTab] = useState<"lost" | "found">("found");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "lost" as const, itemName: "", location: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = ITEMS.filter((i) => i.type === tab);

  async function handleReport(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: reportLostFoundItem({ type: form.type, item_name: form.itemName, location_id: form.location, description: form.description, reporter_id: userId })
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setForm({ type: "lost", itemName: "", location: "", description: "" });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lost & Found</h1>
          <p className="text-slate-500 text-sm mt-0.5">General campus locations only — no personal details exposed.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#2a4f7c] transition-colors"
        >
          Report Item
        </button>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-green-700 text-sm">
          <span>✓</span> Your report has been submitted.
        </div>
      )}

      {/* Report form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-800 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Report an Item</h2>
          <form onSubmit={handleReport} className="flex flex-col gap-4">
            <div className="flex gap-2">
              {(["lost", "found"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                    form.type === t ? "bg-[#1e3a5f] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              required
              placeholder="Item name"
              value={form.itemName}
              onChange={(e) => setForm((f) => ({ ...f, itemName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              required
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select general location</option>
              <option value="central-library">Central Library</option>
              <option value="computing-building">Computing Building</option>
              <option value="student-services">Student Services</option>
              <option value="main-cafeteria">Main Cafeteria</option>
              <option value="engineering-building">Engineering Building</option>
            </select>
            <textarea
              placeholder="Brief description (no personal contact info)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#2a4f7c] transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
        {(["found", "lost"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
            }`}
          >
            {t} ({ITEMS.filter((i) => i.type === t).length})
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-slate-800">{item.itemName}</h3>
              <StatusBadge status={item.status} size="sm" />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
              <span>📍</span>
              <span>{item.locationName}</span>
            </div>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{item.reportedAt}</span>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">No {tab} items reported.</div>
        )}
      </div>
    </div>
  );
}
