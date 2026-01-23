export default function SubTabs({ tenant }) {
  const tabs =
    tenant?.about?.tabs || [
      "Team",
      "Auszeichnungen",
      "Werbekampagne",
      "Karriere",
    ];

  return (
    <div className="border-b bg-white/40">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <div className="flex gap-8 justify-center">
          {tabs.map((t, i) => (
            <a
              key={t}
              className={`py-4 text-sm whitespace-nowrap ${
                i === 0
                  ? "border-b-2 border-primary text-primary font-bold"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
