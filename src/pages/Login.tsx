import { useState } from "react";
import type { User } from "../types/campusNow";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your university email and password.");
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with real Supabase Auth — signIn(email, password)
      await new Promise((r) => setTimeout(r, 900));
      const isAdmin = email.includes("admin");
      onLogin({
        id: "user-001",
        name: "Sarah Al-Ahmadi",
        email,
        faculty: "College of Computing",
        helperLevel: "Trusted Helper",
        communityPoints: 240,
        verifiedContributions: 18,
        helpfulResponses: 15,
        isAdmin,
        locationPrivacy: true,
      });
    } catch {
      setError("Sign-in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#1e3a5f]">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-center px-16 py-12 flex-1 text-white">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <span className="bg-blue-500 text-white text-base font-bold px-3 py-2 rounded-lg">CN</span>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CampusNow AI</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Know what's happening around campus — now.
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            A smart community platform that connects students based on their campus location. Ask questions, find lost items, and help fellow students.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Real-time campus status updates", "Community-verified answers", "Lost & Found system", "Volunteer contribution tracking"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 md:rounded-l-3xl">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <span className="bg-[#1e3a5f] text-white text-sm font-bold px-2 py-1 rounded">CN</span>
            <span className="text-xl font-bold text-[#1e3a5f]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CampusNow AI</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h2>
          <p className="text-slate-500 text-sm mb-8">For university students and authorized staff.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">University Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s123456@university.edu.sa"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold text-sm transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Use your university email and student portal password.
          </p>
        </div>
      </div>
    </div>
  );
}
