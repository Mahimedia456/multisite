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

import KnowledgeIndex from "./pages/knowledge/KnowledgeIndex";
import KnowledgeCategories from "./pages/knowledge/KnowledgeCategories";
import KnowledgeArticles from "./pages/knowledge/KnowledgeArticles";
import KnowledgeFaqs from "./pages/knowledge/KnowledgeFaqs";
import KnowledgeForms from "./pages/knowledge/KnowledgeForms";
import KnowledgeSubmissions from "./pages/knowledge/KnowledgeSubmissions";
import KnowledgeSettings from "./pages/knowledge/KnowledgeSettings";

import HowToUseLayout from "./pages/how-to-use/HowToUseLayout";
import HowToUseIndex from "./pages/how-to-use/HowToUseIndex";
import HowToUseDetail from "./pages/how-to-use/HowToUseDetail";
import HowToUseEditor from "./pages/how-to-use/HowToUseEditor";



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

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/brands" element={<BrandsPortfolio />} />
            <Route path="/agencies" element={<Navigate to="/brands" replace />} />
            <Route path="/agency" element={<Navigate to="/brands" replace />} />
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

            <Route path="/knowledge" element={<KnowledgeIndex />} />
            <Route path="/knowledge/categories" element={<KnowledgeCategories />} />
            <Route path="/knowledge/articles" element={<KnowledgeArticles />} />
            <Route path="/knowledge/faqs" element={<KnowledgeFaqs />} />
            <Route path="/knowledge/forms" element={<KnowledgeForms />} />
            <Route
              path="/knowledge/submissions"
              element={<KnowledgeSubmissions />}
            />

            <Route path="/settings" element={<SettingsIndex />} />
            <Route path="/admin-settings" element={<AdminSettingsIndex />} />
            <Route
              path="/admin-settings/:email"
              element={<AdminSettingsDetail />}
            />
            <Route path="/settings/modules" element={<ModuleSettings />} />
            <Route
              path="/module-settings"
              element={<Navigate to="/settings/modules" replace />}
            />
            <Route path="/settings/knowledge" element={<KnowledgeSettings />} />
            <Route path="/knowledge/settings" element={<Navigate to="/settings/knowledge" replace />} />
            <Route path="/website-settings" element={<WebsiteSettingsIndex />} />
            <Route
              path="/website-settings/:brandId"
              element={<WebsiteSettingsDetail />}
            />
            <Route path="/blog-settings" element={<BlogSettings />} />

            <Route path="/brand-inner-pages" element={<BrandInnerPagesIndex />} />
            <Route
              path="/inner-pages"
              element={<Navigate to="/brand-inner-pages" replace />}
            />
            <Route
              path="/brand-inner-pages/:pageId"
              element={<BrandInnerPageDetail />}
            />

            <Route path="/brand-unique-pages" element={<BrandUniquePagesIndex />} />
            <Route
              path="/unique-pages"
              element={<Navigate to="/brand-unique-pages" replace />}
            />
            <Route
              path="/brand-unique-pages/:brandId"
              element={<BrandUniquePagesList />}
            />
            <Route
              path="/brand-unique-pages/:brandId/pages/:pageId/builder"
              element={<BrandUniquePageBuilder />}
            />

            <Route path="/support-chat" element={<SupportChat />} />
            <Route path="/support" element={<Navigate to="/support-chat" replace />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route
  path="/how-to-use"
  element={
    <ProtectedRoute>
      <HowToUseLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<HowToUseIndex />} />
  <Route path="create" element={<HowToUseEditor />} />
  <Route path=":slug" element={<HowToUseDetail />} />
  <Route path=":id/edit" element={<HowToUseEditor />} />
</Route>

            <Route path="/admin/generate-brand" element={<GenerateBrand />} />
            <Route
              path="/generate-brand"
              element={<Navigate to="/admin/generate-brand" replace />}
            />
            <Route path="/admin/ai-site-builder" element={<AISiteBuilder />} />
            <Route
              path="/ai-site-builder"
              element={<Navigate to="/admin/ai-site-builder" replace />}
            />

            <Route path="/site" element={<SitePages />} />
            <Route path="/site-pages" element={<Navigate to="/site" replace />} />
            <Route
              path="/main-website"
              element={<Navigate to="/site" replace />}
            />
            <Route
              path="/site/templates/:templateId/builder"
              element={<TemplateBuilder />}
            />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Route>

          <Route
            path="/admin/page-builder/:pageId"
            element={<VisualPageBuilder />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}