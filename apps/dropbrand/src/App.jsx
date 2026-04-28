import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Team from "./pages/Team.jsx";
import Career from "./pages/Career.jsx";
import KfzVersicherung from "./pages/KfzVersicherung.jsx";
import EAautoVersicherung from "./pages/EAautoVersicherung.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dropbrand" element={<Home />} />

        <Route path="/about-static" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/team" element={<Team />} />
        <Route path="/career" element={<Career />} />
        <Route path="/kfz-versicherung" element={<KfzVersicherung />} />
        <Route path="/e-auto-versicherung" element={<EAautoVersicherung />} />
      </Routes>
    </BrowserRouter>
  );
}