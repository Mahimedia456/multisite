import GlassCard from "../../ui/GlassCard";

export default function BrandShowcase() {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">Aamir PetCare</h3>
          <button className="mt-6 w-full bg-primary text-white py-3 rounded-xl">
            Explore PetCare
          </button>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">
        <div className="p-10">
          <h3 className="text-2xl font-bold">Umair Trust Life</h3>
          <button className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl">
            Explore Trust Life
          </button>
        </div>
      </GlassCard>
    </section>
  );
}
