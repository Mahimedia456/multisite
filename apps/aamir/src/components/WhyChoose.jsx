const IMAGES = {
  cat: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80",
  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
};

const benefits = [
  { title: "Fastest Claims in the Industry", desc: "Most claims are processed within 2 days, so you're not left out of pocket.", dot: "bg-blue-500" },
  { title: "24/7 Vet Chat Support", desc: "Unlimited access to veterinary professionals whenever you need advice.", dot: "bg-purple-500" },
  { title: "Curable Pre-existing Conditions", desc: "We cover curable conditions after a 12-month symptom-free period.", dot: "bg-green-500" },
];

export default function WhyChoose() {
  return (
    <section id="about" className="py-16 bg-[#eaf6f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-primary font-extrabold">
              Why choose petcare+
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900">
              More than just insurance, we're your partner in pet health.
            </h3>

            <div className="mt-7 space-y-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${b.dot} flex items-center justify-center text-white text-xs font-bold`}>
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-gray-900">{b.title}</div>
                    <div className="mt-1 text-xs text-gray-500 leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="bg-white rounded-2xl p-4 shadow-soft w-full max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden relative">
                  <img src={IMAGES.cat} className="h-44 w-full object-cover" alt="" />
                  <div className="absolute bottom-2 left-2 text-[10px] bg-white/90 px-2 py-1 rounded-full text-gray-700">
                    “Best decision ever!”
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden relative">
                  <img src={IMAGES.dog} className="h-44 w-full object-cover" alt="" />
                  <div className="absolute bottom-2 left-2 text-[10px] bg-white/90 px-2 py-1 rounded-full text-gray-900 font-bold">
                    Direct Vet Pay
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
