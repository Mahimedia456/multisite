import GlassCard from "../../ui/GlassCard";

export default function OurStory(props) {
  const { kicker, headline, body, timeline, tenant } = props || {};
  const story = tenant?.about?.story || {};

  const finalKicker = kicker ?? story.label ?? "Our Heritage";
  const finalHeadline = headline ?? story.title ?? "Founded with Purpose";
  const finalBody =
    body ?? story.text ?? "Insurance Holding was built to redefine modern protection.";
  const finalTimeline = Array.isArray(timeline) ? timeline : Array.isArray(story.timeline) ? story.timeline : [];

  return (
    <section className="grid lg:grid-cols-5 gap-8">
      <GlassCard className="lg:col-span-3 p-10">
        <span className="text-primary text-xs font-bold uppercase">{finalKicker}</span>
        <h2 className="text-3xl font-bold mt-4 mb-6">{finalHeadline}</h2>
        <p className="text-slate-600">{finalBody}</p>
      </GlassCard>

      <GlassCard className="lg:col-span-2 p-10">
        <h3 className="font-bold text-xl mb-6">Timeline</h3>
        <ul className="space-y-4 text-sm text-slate-500">
          {finalTimeline.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </GlassCard>
    </section>
  );
}
