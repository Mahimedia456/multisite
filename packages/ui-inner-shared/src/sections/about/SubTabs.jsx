import { useLocation } from "react-router-dom";

export default function SubTabs({ tenant }) {
  const location = useLocation();

  // 👇 tabs config (label + path)
  const tabs =
    tenant?.about?.tabs || [
      { label: "Über uns", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Auszeichnungen", href: "/about#awards" },
      { label: "Werbekampagne", href: "/about#campaign" },
      { label: "Karriere", href: "/career" },
    ];

  return (
    <div className="border-b bg-white/40">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <div className="flex gap-8 justify-center">
          {tabs.map((t) => {
            const isActive =
              location.pathname === t.href ||
              (t.href !== "/" && location.pathname.startsWith(t.href));

            return (
              <a
                key={t.label}
                href={t.href}
                className={`py-4 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-b-2 border-primary text-primary font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {t.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
