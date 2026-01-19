import Icon from "./Icon";

function Card({ icon, title, desc, points, button, variant = "light" }) {
  const isPopular = variant === "popular";

  if (isPopular) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-primary shadow-xl scale-105 z-10 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
          Most Popular
        </div>
        <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm mb-6">
          <Icon name={icon} className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{desc}</p>
        <ul className="space-y-3 mb-8">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm">
              <Icon name="check_circle" className="text-accent text-sm" />
              {p}
            </li>
          ))}
        </ul>
        <button className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:opacity-90 transition-all">
          {button}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-transparent hover:border-accent/30 transition-all group">
      <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-primary dark:text-accent shadow-sm mb-6 group-hover:scale-110 transition-transform">
        <Icon name={icon} className="text-3xl" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{desc}</p>
      <ul className="space-y-3 mb-8">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm">
            <Icon name="check_circle" className="text-accent text-sm" />
            {p}
          </li>
        ))}
      </ul>
      <button className="w-full py-3 rounded-lg border-2 border-primary/20 font-bold text-primary dark:text-white hover:bg-primary hover:text-white transition-all">
        {button}
      </button>
    </div>
  );
}

export default function PolicyTypes() {
  return (
    <section
      id="products"
      className="bg-white dark:bg-gray-900 py-20 border-y border-gray-100 dark:border-gray-800"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 gap-3">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
            Life Insurance Policy Types
          </h2>
          <p className="text-gray-500 max-w-xl">
            Choose the protection that fits your stage of life and financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            icon="timer"
            title="Term Life"
            desc="Flexible duration (10-30 years) for temporary needs like mortgages or child-rearing."
            points={[
              "Lowest monthly premiums",
              "Ideal for young families",
              "Convertible to whole life",
            ]}
            button="Select Term"
          />
          <Card
            variant="popular"
            icon="all_inclusive"
            title="Whole Life"
            desc="Permanent protection that lasts your entire life and builds cash value over time."
            points={[
              "Guaranteed death benefit",
              "Builds tax-deferred cash value",
              "Fixed monthly premiums",
            ]}
            button="Select Whole"
          />
          <Card
            icon="trending_up"
            title="Universal Life"
            desc="Investment-linked flexible premiums for those wanting to manage wealth proactively."
            points={[
              "Adjustable coverage amounts",
              "Flexible payment options",
              "Market-linked growth potential",
            ]}
            button="Select Universal"
          />
        </div>
      </div>
    </section>
  );
}
