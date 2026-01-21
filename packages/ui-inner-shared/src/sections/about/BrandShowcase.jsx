import GlassCard from "../../ui/GlassCard";

export default function BrandShowcase({
  titleLeft,
  titleRight,
  ctaLeft,
  ctaRight,
}) {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">{titleLeft || ""}</h3>
          <a
            href={ctaLeft?.href || "#"}
            className="mt-6 w-full bg-primary text-white py-3 rounded-xl inline-flex items-center justify-center"
          >
            {ctaLeft?.label || ""}
          </a>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">{titleRight || ""}</h3>
          <a
            href={ctaRight?.href || "#"}
            className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl inline-flex items-center justify-center"
          >
            {ctaRight?.label || ""}
          </a>
        </div>
      </GlassCard>
    </section>
  );
}
