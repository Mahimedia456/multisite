const DEFAULT_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB_c9Wf4IOEXhZy2o8RNayvGPWh9buZpztjXY_VGM-sM0wzDYSH-EMmqGidlN3yKle4RAeQrYIrFFnQdSuDnQoQC67Ao7tNimYO40ZbHHxEgDhvNGrSLyg2_OViYRMnViLgffcOHhZ0VKdZp6N-A_TaBXX1I3IbMt_O8OM-bnAmibhfbKSOcUU_dsqP0Lo5CbXhfovRbnD_TjpV0QDmF2X-SQKl_dxle0dv1BVbHFHNHdCmZDQHuyF4MUtviJIcMqbDBrHEaW5NUCw";

export default function HeroSection({
  backgroundImage = DEFAULT_BG,
  headline = "Über uns – Ihr Partner für eine sichere Zukunft",
  subheading = "Wir begleiten Millionen von Menschen weltweit mit passgenauer Beratung, zuverlässigem Schutz und nachhaltiger Vorsorge.",
  buttonLabel = "Ansprechpartner finden",
  buttonHref = "/beratung",
}) {
  return (
    <section className="relative w-full h-[500px] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="max-w-2xl bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            {headline}
          </h1>

          <p className="text-lg text-white/90 mb-8">{subheading}</p>

          <a
            href={buttonHref}
            className="inline-flex bg-primary hover:bg-primary-dark text-text-dark font-bold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}