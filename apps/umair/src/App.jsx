import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Career from "./pages/Career";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* ✅ TEAM PAGE */}
        <Route path="/team" element={<Team />} />
        <Route path="/career" element={<Career />} />

      </Routes>
    </BrowserRouter>
  );
}
