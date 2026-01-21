import GlassCard from "../../ui/GlassCard";

export default function Leadership({ title, team }) {
  const list = Array.isArray(team) ? team : [];

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">{title ?? ""}</h2>

      {list.length ? (
        <div className="grid md:grid-cols-3 gap-8">
          {list.map((name, idx) => (
            <GlassCard key={`${name}-${idx}`} className="p-8 text-center">
              <div className="h-32 bg-slate-200 rounded-xl mb-6" />
              <h4 className="font-bold">{name ?? ""}</h4>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 text-center"> </div>
      )}
    </section>
  );
}
