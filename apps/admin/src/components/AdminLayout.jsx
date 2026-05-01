import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const SIDEBAR_OPEN = 270;
const SIDEBAR_COLLAPSED = 88;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_OPEN;

  return (
    <div className="min-h-screen bg-[#f7f4fb] dark:bg-slate-950">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <AdminTopbar />

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}