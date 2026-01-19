import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full">
              Secure Their Future
            </span>

            <h1 className="text-5xl md:text-6xl font-black text-primary dark:text-white leading-[1.1]">
              Secure Their Future, <span className="text-accent">Starting Today</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Professional financial security tailored for your family. Get the peace of mind you deserve with our premium coverage plans designed for professionals.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="bg-primary dark:bg-white dark:text-primary text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl flex items-center gap-2 hover:scale-[1.02] transition-transform">
              Calculate Your Coverage <Icon name="calculate" className="" />
            </button>
            <button className="bg-white dark:bg-gray-800 border-2 border-primary/10 text-primary dark:text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Talk to an Advisor
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 w-full relative">
          <div
            className="w-full aspect-square bg-cover bg-center rounded-[2rem] shadow-2xl overflow-hidden relative"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB883rP1ODocueCO-h3QbMv989-EnoF5jN-tS1d1Ni4-d3l3BZwsaeua2osrssQu0m3aHIPa7NcQd5t1la6xdL-8xcjp6Mv-ld7BvjUKbSxIkDsigCQm2h4Zb-rI7nO3HSRfC1N4glQkIvBw5kqv-jJpVW_ghCWgjmsZhUdpEPlqdgIuDrPghn0GPV2eq8nGiMIdYdMa2ti1M61tHKUUeyx_dtivvR0SbrSUPeF6Le4SnS7I9udQa6awJZffdjOtpIEUBkuQsq0zg4")',
            }}
          >
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-accent/20 hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center">
                <Icon name="star" className="font-bold" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary dark:text-white">A+ Rated Security</p>
                <p className="text-xs text-gray-500">By Standard &amp; Poor's</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
