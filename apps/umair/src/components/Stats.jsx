function Stat({ value, label }) {
  return (
    <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
      <p className="text-4xl font-black text-primary dark:text-accent mb-2">{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Stat value="99.8%" label="Claims Paid" />
        <Stat value="50yr+" label="In Business" />
        <Stat value="2M+" label="Active Policies" />
        <Stat value="A++" label="Financial Rating" />
      </div>
    </section>
  );
}
