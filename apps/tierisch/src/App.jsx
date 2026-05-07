import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Team from "./pages/Team";
import AboutTierisch from "./pages/AboutTierisch";
import Contact from "./pages/Contact";
import EAautoVersicherung from "./pages/EAautoVersicherung";
import KfzVersicherung from "./pages/KfzVersicherung";

import BrandLoader from "./components/BrandLoader";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import UniquePagePreview from "./pages/UniquePagePreview.jsx";
import VisiblePage from "./components/VisiblePage.jsx";
import { useBrandTheme } from "./hooks/useBrandTheme";

const BRAND = "allianz4";

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
                <AboutTierisch />
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

          <Route path="/team" element={<Team />} />

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