// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

import BrandsPortfolio from "./pages/BrandsPortfolio";
import BrandDetail from "./pages/BrandDetail";
import BrandTemplates from "./pages/BrandTemplates";
import TemplateBuilder from "./pages/TemplateBuilder";

import SitePages from "./pages/SitePages";

import BrandInnerPagesIndex from "./pages/BrandInnerPagesIndex";
import BrandInnerPageDetail from "./pages/BrandInnerPageDetail";

import BrandUniquePagesIndex from "./pages/BrandUniquePagesIndex";
import BrandUniquePagesList from "./pages/BrandUniquePagesList";
import BrandUniquePageBuilder from "./pages/BrandUniquePageBuilder";

import GenerateBrand from "./pages/GenerateBrand";
import AISiteBuilder from "./pages/AISiteBuilder";
import VisualPageBuilder from "./pages/VisualPageBuilder";
import SupportChat from "./pages/SupportChat.jsx";
import Notifications from "./pages/Notifications.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Brands */}
            <Route path="/brands" element={<BrandsPortfolio />} />
            <Route path="/brands/:brandId" element={<BrandDetail />} />
            <Route path="/brands/:brandId/templates" element={<BrandTemplates />} />
            <Route
              path="/brands/:brandId/templates/:templateId/builder"
              element={<TemplateBuilder />}
            />

            {/* Inner Pages */}
            <Route path="/brand-inner-pages" element={<BrandInnerPagesIndex />} />
            <Route
              path="/brand-inner-pages/:pageId"
              element={<BrandInnerPageDetail />}
            />

            {/* Brand Unique Pages */}
            <Route path="/brand-unique-pages" element={<BrandUniquePagesIndex />} />
            <Route
              path="/brand-unique-pages/:brandId"
              element={<BrandUniquePagesList />}
            />
            <Route
              path="/brand-unique-pages/:brandId/pages/:pageId/builder"
              element={<BrandUniquePageBuilder />}
            />

            <Route path="/support-chat" element={<SupportChat />} />
            <Route path="/notifications" element={<Notifications />} />
            

            {/* Generate Brand */}
            <Route path="/admin/generate-brand" element={<GenerateBrand />} />

            {/* AI Site Builder */}
            <Route path="/admin/ai-site-builder" element={<AISiteBuilder />} />

            {/* Main Website */}
            <Route path="/site" element={<SitePages />} />
            <Route
              path="/site/templates/:templateId/builder"
              element={<TemplateBuilder />}
            />
          </Route>

          <Route path="/admin/page-builder/:pageId" element={<VisualPageBuilder />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}