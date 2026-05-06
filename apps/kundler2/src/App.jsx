import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import BrandLoader from "./components/BrandLoader";
import EAautoVersicherung from "./pages/EAautoVersicherung";
import KfzVersicherung from "./pages/KfzVersicherung";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import { useBrandTheme } from "./hooks/useBrandTheme";
import UniquePagePreview from "./pages/UniquePagePreview.jsx";

export default function App() {
  useBrandTheme("kundler3");

  return (
    <>
      <BrandLoader duration={3000} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/e-auto-versicherung" element={<EAautoVersicherung />} />
          <Route path="/kfz-versicherung" element={<KfzVersicherung />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-preview/:slug" element={<UniquePagePreview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}