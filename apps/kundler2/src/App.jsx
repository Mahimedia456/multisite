import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Team from "./pages/Team";
import BrandLoader from "./components/BrandLoader";
import AboutKundler2 from "./pages/about-kundler2/AboutKundler2";
import EAautoVersicherung from "./pages/EAautoVersicherung"; // ✅ ADD THIS
import KfzVersicherung from "./pages/KfzVersicherung"; // ✅ MUST



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
    <>
      {/* ✅ 3 sec brand loader */}
      <BrandLoader duration={3000} />

      <BrowserRouter>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* ABOUT (shared page) */}
        

          {/* TEAM (shared page) */}
          <Route path="/team" element={<Team />} />
          <Route path="/about-kundler2" element={<AboutKundler2 />} />
          <Route path="/e-auto-versicherung" element={<EAautoVersicherung />} />
          <Route path="/kfz-versicherung" element={<KfzVersicherung />} />



        </Routes>
      </BrowserRouter>
    </>
  );
}
