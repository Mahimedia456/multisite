import GlassCard from "../../ui/GlassCard";
import Icon from "../../ui/Icon";

export default function MissionVision(props) {
  const { missionTitle, missionBody, visionTitle, visionBody, tenant } = props || {};
  const mv = tenant?.about?.missionVision || {};

  const mTitle = missionTitle ?? "Mission";
  const vTitle = visionTitle ?? "Vision";
  const mBody = missionBody ?? mv.mission ?? "Empower families through insurance clarity.";
  const vBody = visionBody ?? mv.vision ?? "Become the most trusted insurance group.";

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <GlassCard className="p-12 border-l-4 border-primary">
        <Icon name="rocket_launch" className="text-primary text-4xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">{mTitle}</h3>
        <p className="text-slate-600">{mBody}</p>
      </GlassCard>

      <GlassCard className="p-12 border-l-4 border-primary">
        <Icon name="visibility" className="text-primary text-4xl mb-4" />
        <h3 className="text-2xl font-bold mb-2">{vTitle}</h3>
        <p className="text-slate-600">{vBody}</p>
      </GlassCard>
    </section>
  );
}
