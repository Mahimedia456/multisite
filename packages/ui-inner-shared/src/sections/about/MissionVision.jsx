import GlassCard from "../../ui/GlassCard";
import Icon from "../../ui/Icon";

export default function MissionVision({ visionTitle, visionBody, missionTitle, missionBody }) {
  return (
    <section className="grid md:grid-cols-2 gap-8">
      <GlassCard className="p-12 border-l-4 border-primary">
        <Icon name="rocket_launch" className="text-primary text-4xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">{missionTitle ?? ""}</h3>
        <p className="text-slate-600">{missionBody ?? ""}</p>
      </GlassCard>

      <GlassCard className="p-12 border-l-4 border-primary">
        <Icon name="visibility" className="text-primary text-4xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">{visionTitle ?? ""}</h3>
        <p className="text-slate-600">{visionBody ?? ""}</p>
      </GlassCard>
    </section>
  );
}
