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

import KnowledgeArea from "./pages/KnowledgeArea.jsx";
import KnowledgeArticle from "./pages/KnowledgeArticle.jsx";
import KnowledgeForm from "./pages/KnowledgeForm.jsx";

import NotFound from "./pages/NotFound.jsx";

const BRAND = "allianz4";

export default function App() {
  useBrandTheme(BRAND);

  const lang = localStorage.getItem("site_lang") || "de";

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

          <Route
            path="/knowledge"
            element={<KnowledgeArea brandSlug={BRAND} lang={lang} />}
          />

          <Route
            path="/knowledge/articles/:slug"
            element={<KnowledgeArticle brandSlug={BRAND} lang={lang} />}
          />

          <Route
            path="/knowledge/forms/:slug"
            element={<KnowledgeForm brandSlug={BRAND} lang={lang} />}
          />

          <Route path="/admin-preview/:slug" element={<UniquePagePreview />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}