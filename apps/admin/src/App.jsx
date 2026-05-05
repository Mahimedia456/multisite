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


import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import AuthLayout from "./layouts/AuthLayout.jsx";


import BlogsIndex from "./pages/BlogsIndex.jsx";
import BlogForm from "./pages/BlogForm.jsx";
import BlogSettings from "./pages/BlogSettings.jsx";
import BlogCategories from "./pages/BlogCategories.jsx";

import AdminSettingsIndex from "./pages/AdminSettingsIndex.jsx";
import AdminSettingsDetail from "./pages/AdminSettingsDetail.jsx";
import ModuleSettings from "./pages/ModuleSettings.jsx";
import WebsiteSettingsIndex from "./pages/WebsiteSettingsIndex.jsx";
import WebsiteSettingsDetail from "./pages/WebsiteSettingsDetail.jsx";
import SettingsIndex from "./pages/SettingsIndex.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route element={<AuthLayout />}>
  <Route path="/login" element={<AdminLogin />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/verify-otp" element={<VerifyOtp />} />
  <Route path="/reset-password" element={<ResetPassword />} />
</Route>
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

            <Route path="/blogs" element={<BlogsIndex />} />
<Route path="/blogs/create" element={<BlogForm />} />
<Route path="/blogs/:blogId/edit" element={<BlogForm />} />
<Route path="/blog-categories" element={<BlogCategories />} />
<Route path="/settings" element={<SettingsIndex />} />
<Route path="/admin-settings" element={<AdminSettingsIndex />} />
<Route path="/admin-settings/:email" element={<AdminSettingsDetail />} />
<Route path="/settings/modules" element={<ModuleSettings />} />
<Route path="/website-settings" element={<WebsiteSettingsIndex />} />
<Route path="/website-settings/:brandId" element={<WebsiteSettingsDetail />} />
<Route path="/blog-settings" element={<BlogSettings />} />
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