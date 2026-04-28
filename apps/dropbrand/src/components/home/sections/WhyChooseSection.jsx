import { CheckCircle2 } from "lucide-react";

const items = [
  "Transparent pricing with no hidden fees",
  "Experienced advisors from first consultation",
  "Fast and hassle-free claims process",
  "Flexible plans tailored to your needs",
];

export default function WhyChooseSection() {
  return (
    <section className="bg-[#f8f4ed] py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">Why Choose Us</p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Trusted insurance solution backed by experience
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            We combine industry expertise, transparent policies, and dedicated support to deliver insurance solutions you can depend on.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((x) => (
              <div key={x} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 className="shrink-0 text-[#ffb347]" />
                <span className="text-sm font-bold text-zinc-700">{x}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1100"
            alt=""
            className="h-[520px] w-full rounded-[2rem] object-cover shadow-xl"
          />
          <div className="absolute bottom-6 left-6 max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
            <p className="font-bold text-zinc-800">
              “The team explained every option clearly and made the process simple.”
            </p>
            <p className="mt-3 text-sm font-black text-[#0f4a2c]">Ronald Richards</p>
          </div>
        </div>
      </div>
    </section>
  );
}