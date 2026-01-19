const testimonials = [
  {
    text:
      "I never worry about vet bills anymore. When Max swallowed a sock, PetCare+ covered 90% of the surgery. The app made it so easy!",
    name: "Sarah Jenkins",
    meta: "Owner of Max (Golden Retriever)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    text:
      "Customer service is actual humans, not bots. They helped me customize a plan that fit my budget but still gave great coverage.",
    name: "Marcus Chen",
    meta: "Owner of Luna (Siamese)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    text:
      "We switched from a competitor because of the direct pay feature. My vet loves it and so do I. No more waiting for checks!",
    name: "Emily Rodriguez",
    meta: "Owner of Cooper (Bulldog)",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Loved by pet parents everywhere
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-2xl">
              Join thousands of happy pet owners who trust PetCare+ with their family's health.
            </p>
          </div>

          <div className="hidden sm:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              ←
            </button>
            <button className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors shadow-lg shadow-primary/20">
              →
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex gap-1 text-accent-yellow text-sm">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>

              <p className="mt-5 text-sm text-gray-700 leading-relaxed">
                “{t.text}”
              </p>

              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
