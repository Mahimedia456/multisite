import { NavLink, useNavigate } from "react-router-dom";
import MIcon from "./MIcon";
import { logout, getCurrentUser } from "../lib/auth";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: "grid_view" },
  { to: "/brands", label: "Brands", icon: "layers" },
  { to: "/brand-inner-pages", label: "Brand Inner Pages", icon: "description" },
  { to: "/brand-unique-pages", label: "Brand Unique Pages", icon: "web" },

  // NEW
  { to: "/support-chat", label: "Support Chat", icon: "forum" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

 const nav = user?.permissions
  ? NAV_ITEMS.filter((item) => user.permissions.includes(item.label))
  : NAV_ITEMS;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="w-[270px] shrink-0 min-h-screen bg-white/70 border-r border-[#efeaf6] flex flex-col">
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-violet-600 to-violet-700 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
            <MIcon name="shield" className="text-[22px]" />
          </div>

          <div>
            <div className="font-extrabold text-gray-900 leading-tight">
              {user?.name || "Holding Co."}
            </div>
            <div className="text-xs text-violet-600 font-semibold">
              {user?.slug || "Global Admin"}
            </div>
          </div>
        </div>
      </div>

      <nav className="px-4 py-2 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition",
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/15"
                  : "text-gray-700 hover:bg-violet-50",
              ].join(" ")
            }
          >
            <MIcon name={item.icon} className="text-[20px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-6 pt-6">
        <button
          onClick={() => navigate("/site")}
          className="w-full h-11 rounded-2xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/20 hover:brightness-105 transition inline-flex items-center justify-center gap-2"
        >
          <MIcon name="swap_horiz" className="text-[20px]" />
          Need Help?
        </button>

        <div className="mt-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-violet-50 transition">
            <MIcon name="help" className="text-[20px]" />
            Help
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <MIcon name="logout" className="text-[20px]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}