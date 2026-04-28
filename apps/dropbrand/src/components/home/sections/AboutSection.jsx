export default function AboutSection() {
  return (
    <section className="bg-[#f8f4ed]">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div className="relative grid grid-cols-2 gap-4">
          <div className="h-[420px] rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=900')] bg-cover bg-center shadow-xl" />
          <div className="mt-16 h-[360px] rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=900')] bg-cover bg-center shadow-xl" />
          <div className="absolute bottom-8 left-1/2 rounded-3xl bg-white p-5 shadow-2xl">
            <div className="text-3xl font-black text-[#0f4a2c]">80+</div>
            <p className="text-xs font-bold text-zinc-500">Awards & recognition</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-widest text-[#0f4a2c]">About Us</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Protecting lives, assets and futures with confidence
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            We provide reliable insurance solutions designed to safeguard individuals, families, and businesses with clear coverage, honest guidance, and dependable support.
          </p>

          <div className="mt-8 rounded-3xl border-l-4 border-[#ffb347] bg-white p-6 shadow-sm">
            <p className="text-lg font-bold text-zinc-800">
              “Insurance is not just about policies. It is about protecting people, dreams, and the future they are building.”
            </p>
          </div>

          <button className="mt-8 rounded-full bg-[#ffb347] px-6 py-3 font-black text-[#07361f]">
            More About Us
          </button>
        </div>
      </div>
    </section>
  );
}