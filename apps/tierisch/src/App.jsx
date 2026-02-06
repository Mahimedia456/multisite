import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";

import BrandLoader from "./components/BrandLoader";

export default function App() {
  return (
    <>
      {/* ✅ 3 sec brand loader */}
      <BrandLoader duration={3000} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
