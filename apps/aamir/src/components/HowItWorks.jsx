const steps = [
  { title: "1. Create Profile", desc: "Tell us about your pet’s breed, age, and any pre-existing conditions.", icon: "🐾" },
  { title: "2. Customize Plan", desc: "Choose the deductible and coverage limit that fits your budget perfectly.", icon: "🎚️" },
  { title: "3. Visit Any Vet", desc: "We cover visits to any licensed vet in the country, including specialists.", icon: "🩺" },
  { title: "4. Get Reimbursed", desc: "Snap a photo of your bill, upload it to the app, and get paid fast.", icon: "💲" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest text-primary font-extrabold">How it works</div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">Simple steps to peace of mind</h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
            Getting protected is easier than you think. Here is how our process works from start to finish.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-soft transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
                {s.icon}
              </div>
              <div className="mt-4 text-sm font-extrabold text-gray-900">{s.title}</div>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
