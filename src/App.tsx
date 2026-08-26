import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Volunteer from "./pages/Volunteer";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "var(--background)", direction: "rtl" }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
