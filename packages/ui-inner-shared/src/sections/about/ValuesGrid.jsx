import GlassCard from "../../ui/GlassCard";
import Icon from "../../ui/Icon";
const values = [
  ["lightbulb", "Clarity"],
  ["verified_user", "Security"],
  ["support_agent", "Support"],
  ["visibility", "Transparency"],
  ["auto_awesome", "Innovation"],
  ["handshake", "Reliability"],
];

export default function ValuesGrid() {
  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map(([icon, label]) => (
          <GlassCard key={label} className="p-8">
            <Icon name={icon} className="text-primary text-3xl mb-4" />
            <h4 className="font-bold">{label}</h4>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
