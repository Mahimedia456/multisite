import GlassCard from "../../ui/GlassCard";
import Icon from "../../ui/Icon";

export default function ValuesGrid(props) {
  const { title, values } = props || {};

  const list = Array.isArray(values) && values.length
    ? values
    : [
        { icon: "lightbulb", label: "Clarity" },
        { icon: "verified_user", label: "Security" },
        { icon: "support_agent", label: "Support" },
        { icon: "visibility", label: "Transparency" },
        { icon: "auto_awesome", label: "Innovation" },
        { icon: "handshake", label: "Reliability" },
      ];

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">{title || "Our Core Values"}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((v) => (
          <GlassCard key={v.label} className="p-8">
            <Icon name={v.icon} className="text-primary text-3xl mb-4" />
            <h4 className="font-bold">{v.label}</h4>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
