import GlassCard from "../../ui/GlassCard";
import Icon from "../../ui/Icon";

export default function ValuesGrid({ title, values }) {
  const list = Array.isArray(values) ? values : [];

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">{title || ""}</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((v, idx) => (
          <GlassCard key={idx} className="p-8">
            <Icon name={v?.icon || "auto_awesome"} className="text-primary text-3xl mb-4" />
            <h4 className="font-bold">{v?.label || ""}</h4>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
