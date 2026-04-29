export default function ContactHeroSection({
  eyebrow = "Kontakt",
  headline = "Fragen? Wir beraten Sie persönlich",
  subheading = "Unser Team hilft Ihnen, den passenden Versicherungsschutz zu finden.",
}) {
  return (
    <section className="bg-primary py-24 text-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>

        <h1 className="mx-auto max-w-3xl text-5xl font-black leading-tight md:text-6xl">
          {headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75">
          {subheading}
        </p>
      </div>
    </section>
  );
}