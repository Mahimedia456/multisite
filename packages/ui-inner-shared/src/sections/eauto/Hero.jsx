export default function Hero({
  badgeText = "Testsieger 2024",
  titleTop = "E-Auto",
  titleAccent = "Versicherung",
  desc = "Akku-Schutz inklusive. Schützen Sie Ihr Elektroauto mit dem Rundum-Sorglos-Paket der Allianz.",
  primaryCta = "Tarif berechnen",
  secondaryCta = "Berater finden",
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCtzDCuzqfcNg7_CAC4ZM2GurGHrm-F3INylAj2PSwmpHkWrwgbbEt4NY8hCX_q5hcCYYHc0X52OhH72PyluY7udz8vmOmOROzBwS6KZq429ybizACx6a64_zEWg_XLzp4mNevrZraNfbQvrOB3kqzaPEbuIPZT_kKToCvOi9PprJdEcsPy61pmW0CjRc3EueA58AxHQYG_DJUBhGqAJciHte-mLarGNuog6OXZ8PDK6IuCSanU0ueenu6WK9FXMPcjBudiaWMH17Y",
}) {
  return (
    <section className="py-12 md:py-20 flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1 flex flex-col gap-6 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">electric_car</span>
          {badgeText}
        </div>

        <h1 className="text-slate-900 text-5xl md:text-6xl font-black leading-tight tracking-tight">
          {titleTop} <br />
          <span className="text-primary">{titleAccent}</span>
        </h1>

        <p className="text-slate-600 text-lg md:text-xl font-normal max-w-lg">
          {desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button className="flex min-w-[200px] items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-lg font-bold hover:shadow-lg transition-all">
            {primaryCta}
          </button>
          <button className="flex min-w-[200px] items-center justify-center rounded-lg h-14 px-8 border-2 border-primary text-primary text-lg font-bold hover:bg-primary/5 transition-all">
            {secondaryCta}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-200"
          style={{
            backgroundImage: `url("${imageUrl}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-label="Electric car charging"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
