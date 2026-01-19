import GlassCard from "../../ui/GlassCard";

export default function OurStory() {
  return (
    <section className="grid lg:grid-cols-5 gap-8">
      <GlassCard className="lg:col-span-3 p-10">
        <span className="text-primary text-xs font-bold uppercase tracking-widest">
          Our Heritage
        </span>
        <h2 className="text-3xl font-bold mt-4 mb-6">Founded with Purpose</h2>
        <p className="text-slate-600 leading-relaxed">
          Insurance Holding was built to redefine modern protection through
          clarity, trust, and specialization.
        </p>
      </GlassCard>

      <GlassCard className="lg:col-span-2 p-10">
        <h3 className="font-bold text-xl mb-6">Evolution Timeline</h3>
        <ul className="space-y-4 text-sm text-slate-500">
          <li>2010 — Foundation</li>
          <li>2015 — Umair Trust Life</li>
          <li>2021 — Aamir PetCare</li>
        </ul>
      </GlassCard>
    </section>
  );
}
