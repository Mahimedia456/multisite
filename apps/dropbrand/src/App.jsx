import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Team from "./pages/Team.jsx";
import Career from "./pages/Career.jsx";
import KfzVersicherung from "./pages/KfzVersicherung.jsx";
import EAautoVersicherung from "./pages/EAautoVersicherung.jsx";
import AdminPreviewPage from "./pages/AdminPreviewPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dropbrand" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/about-static" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/team" element={<Team />} />
        <Route path="/career" element={<Career />} />
        <Route path="/kfz-versicherung" element={<KfzVersicherung />} />
        <Route path="/e-auto-versicherung" element={<EAautoVersicherung />} />

        <Route path="/admin-preview/:slug" element={<AdminPreviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}