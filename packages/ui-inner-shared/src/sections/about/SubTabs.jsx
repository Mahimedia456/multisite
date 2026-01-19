export default function SubTabs() {
  const tabs = ["Overview", "Our Story", "Brands", "Leadership"];
  return (
    <div className="border-b bg-white/40">
      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        {tabs.map((t, i) => (
          <a
            key={t}
            className={`py-4 text-sm ${
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
  );
}
