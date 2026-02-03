import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";

export default function App() {
  useEffect(() => {
    // ✅ kundler theme: yellow accent + black base
    document.documentElement.style.setProperty("--primary", "245 196 0");       // #f5c400
    document.documentElement.style.setProperty("--primary-dark", "214 171 0");  // darker yellow
    document.documentElement.style.setProperty("--accent", "245 196 0");
    document.documentElement.style.setProperty("--bg-light", "246 247 248");    // #f6f7f8
    document.documentElement.style.setProperty("--bg-dark", "7 10 13");         // #070A0D
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* ABOUT (shared page) */}
        <Route path="/about" element={<About />} />

        {/* TEAM (shared page) */}
        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}
