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

import BrandInnerPages from "./pages/BrandInnerPages";
import BrandInnerPageDetail from "./pages/BrandInnerPageDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Brands */}
          <Route path="/brands" element={<BrandsPortfolio />} />
          <Route path="/brands/:brandId" element={<BrandDetail />} />
          <Route path="/brands/:brandId/templates" element={<BrandTemplates />} />
          <Route
            path="/brands/:brandId/templates/:templateId/builder"
            element={<TemplateBuilder />}
          />

          {/* Brand Inner Pages (global entry from sidebar) */}
          <Route path="/brand-inner-pages" element={<BrandInnerPages />} />
          <Route
            path="/brand-inner-pages/:pageId"
            element={<BrandInnerPageDetail />}
          />

          {/* (optional) per brand inner pages too */}
          <Route path="/brands/:brandId/pages" element={<BrandInnerPages />} />
          <Route
            path="/brands/:brandId/pages/:pageId"
            element={<BrandInnerPageDetail />}
          />

          {/* Main Website */}
          <Route path="/site" element={<SitePages />} />
          <Route
            path="/site/templates/:templateId/builder"
            element={<TemplateBuilder />}
          />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
