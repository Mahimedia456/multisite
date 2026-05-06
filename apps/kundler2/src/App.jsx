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
import VisiblePage from "./components/VisiblePage.jsx";

const BRAND = "kundler3";

export default function App() {
  useBrandTheme(BRAND);

  return (
    <>
      <BrandLoader duration={3000} />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <VisiblePage brandSlug={BRAND} type="unique" slug="home">
                <Home />
              </VisiblePage>
            }
          />

          <Route
            path="/about"
            element={
              <VisiblePage brandSlug={BRAND} type="unique" slug="about">
                <About />
              </VisiblePage>
            }
          />

          <Route
            path="/contact"
            element={
              <VisiblePage brandSlug={BRAND} type="unique" slug="contact">
                <Contact />
              </VisiblePage>
            }
          />

          <Route
            path="/e-auto-versicherung"
            element={
              <VisiblePage brandSlug={BRAND} type="shared" slug="e-auto-versicherung">
                <EAautoVersicherung />
              </VisiblePage>
            }
          />

          <Route
            path="/kfz-versicherung"
            element={
              <VisiblePage brandSlug={BRAND} type="shared" slug="kfz-versicherung">
                <KfzVersicherung />
              </VisiblePage>
            }
          />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/admin-preview/:slug" element={<UniquePagePreview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}