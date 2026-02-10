import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Team from "./pages/Team";
import AboutTierisch from "./pages/AboutTierisch";
import EAautoVersicherung from "./pages/EAautoVersicherung";
import KfzVersicherung from "./pages/KfzVersicherung"; // ✅ ADD THIS

import BrandLoader from "./components/BrandLoader";

export default function App() {
  return (
    <>
      <BrandLoader duration={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<AboutTierisch />} />
          <Route path="/e-auto-versicherung" element={<EAautoVersicherung />} />
          <Route path="/kfz-versicherung" element={<KfzVersicherung />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
