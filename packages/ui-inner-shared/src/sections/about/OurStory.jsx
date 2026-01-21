import GlassCard from "../../ui/GlassCard";

export default function OurStory({ kicker, headline, body, timeline }) {
  const list = Array.isArray(timeline) ? timeline : [];

  return (
    <section className="grid lg:grid-cols-5 gap-8">
      <GlassCard className="lg:col-span-3 p-10">
        <span className="text-primary text-xs font-bold uppercase">{kicker || ""}</span>
        <h2 className="text-3xl font-bold mt-4 mb-6">{headline || ""}</h2>
        <p className="text-slate-600">{body || ""}</p>
      </GlassCard>

      <GlassCard className="lg:col-span-2 p-10">
        <h3 className="font-bold text-xl mb-6">Timeline</h3>
        <ul className="space-y-4 text-sm text-slate-500">
          {list.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </GlassCard>
    </section>
  );
}
