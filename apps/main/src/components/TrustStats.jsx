function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs font-semibold text-[#665a73] dark:text-[#a195ad] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function TrustStats() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-semibold tracking-tight">Secure. Reliable. Global.</h2>
        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Stat icon="security" value="256-bit" label="Encryption" />
        <Stat icon="support_agent" value="24/7" label="Global Support" />
        <Stat icon="verified" value="99.9%" label="Claim Accuracy" />
        <Stat icon="public" value="50+" label="Countries Served" />
      </div>
    </section>
  );
}
