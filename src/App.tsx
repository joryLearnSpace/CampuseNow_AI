import { useState } from "react";
import type { Page, User } from "./types/campusNow";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Campus from "./pages/Campus";
import LocationDetails from "./pages/LocationDetails";
import Ask from "./pages/Ask";
import RequestDetails from "./pages/RequestDetails";
import LostFound from "./pages/LostFound";
import Volunteer from "./pages/Volunteer";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("login");
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  function navigate(p: Page, params?: Record<string, string>) {
    setPage(p);
    setPageParams(params ?? {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSignOut() {
    setUser(null);
    setPage("login");
    setPageParams({});
  }

  if (!user || page === "login") {
    return <Login onLogin={(u) => { setUser(u); navigate("home"); }} />;
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home user={user} navigate={navigate} />;
      case "campus":
        return <Campus navigate={navigate} />;
      case "location-details":
        return <LocationDetails locationId={pageParams.locationId ?? "central-library"} navigate={navigate} />;
      case "ask":
        return <Ask userId={user.id} navigate={navigate} />;
      case "request-details":
        return <RequestDetails requestId={pageParams.requestId ?? "r1"} userId={user.id} navigate={navigate} />;
      case "lost-found":
        return <LostFound />;
      case "volunteer":
        return <Volunteer user={user} />;
      case "profile":
        return <Profile user={user} onUpdate={setUser} onSignOut={handleSignOut} />;
      case "admin":
        return user.isAdmin ? <AdminDashboard /> : <Home user={user} navigate={navigate} />;
      default:
        return <Home user={user} navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar currentPage={page} navigate={navigate} user={user} onSignOut={handleSignOut} />
      <main className="min-h-[calc(100vh-56px)]">
        {renderPage()}
      </main>
    </div>
  );
}
