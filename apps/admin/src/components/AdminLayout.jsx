// src/components/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f4fb]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
