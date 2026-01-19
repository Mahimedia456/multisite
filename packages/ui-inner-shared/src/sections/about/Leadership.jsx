import GlassCard from "../../ui/GlassCard";

export default function Leadership() {
  const team = ["Julian Sterling", "Sarah Chen", "Marcus Thorne"];
  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">
        Guided by Experience
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {team.map((name) => (
          <GlassCard key={name} className="p-8 text-center">
            <div className="h-32 bg-slate-200 rounded-xl mb-6" />
            <h4 className="font-bold">{name}</h4>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
