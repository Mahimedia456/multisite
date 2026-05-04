import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Team from "./pages/Team";
import AboutTierisch from "./pages/AboutTierisch";
import EAautoVersicherung from "./pages/EAautoVersicherung";
import KfzVersicherung from "./pages/KfzVersicherung";

import BrandLoader from "./components/BrandLoader";
import Blogs from "./pages/Blogs.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";

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

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}