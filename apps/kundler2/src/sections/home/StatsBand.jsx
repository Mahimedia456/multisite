const stats = [
  { value: "15k+", label: "Projects Delivered" },
  { value: "250+", label: "Satisfied Clients" },
  { value: "4.9★", label: "Average Rating" },
];

export default function StatsBand() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-[#f6f7f8] border border-black/5 p-8 sm:p-10">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              Trusted Performance
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">
              Driven by passion for quality and innovation
            </h2>
            <p className="mt-3 text-sm text-black/60 max-w-2xl mx-auto">
              We build spaces that reflect strength, sustainability, and lasting value.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.value} className="rounded-3xl bg-white border border-black/5 p-7 shadow-sm">
                <div className="text-3xl font-extrabold text-black">{s.value}</div>
                <div className="mt-1 text-[11px] font-semibold text-black/60">{s.label}</div>
                <div className="mt-4 h-1.5 rounded-full bg-black/5 overflow-hidden">
                  <div className="h-full w-[78%] bg-[#f5c400]" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button className="h-11 px-6 rounded-xl bg-[#f5c400] text-black font-extrabold text-sm hover:opacity-90">
              Request a Proposal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
