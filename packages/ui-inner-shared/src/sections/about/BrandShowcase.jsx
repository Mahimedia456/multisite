import GlassCard from "../../ui/GlassCard";

export default function BrandShowcase({ data }) {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">{data?.titleLeft || "Aamir PetCare"}</h3>
          <a
            href={data?.ctaLeft?.href || "#"}
            className="mt-6 w-full bg-primary text-white py-3 rounded-xl inline-flex items-center justify-center"
          >
            {data?.ctaLeft?.label || "Explore PetCare"}
          </a>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">{data?.titleRight || "Umair Trust Life"}</h3>
          <a
            href={data?.ctaRight?.href || "#"}
            className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl inline-flex items-center justify-center"
          >
            {data?.ctaRight?.label || "Explore Trust Life"}
          </a>
        </div>
      </GlassCard>
    </section>
  );
}
