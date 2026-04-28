export default function TestimonialsSection() {
  return (
    <section className="bg-background-light py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200"
          alt=""
          className="h-[560px] w-full rounded-[2rem] object-cover shadow-soft-lg"
        />

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-black uppercase tracking-widest text-primary">Testimonials</p>
          <h2 className="mt-4 text-4xl font-black">Building trust through real customers</h2>
          <div className="mt-8 text-accent">★★★★★</div>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            “The team took time to understand my needs and explained every option clearly.
            From buying the policy to getting support later, the experience was smooth.”
          </p>
          <div className="mt-7">
            <p className="font-black">Robert Fox</p>
            <p className="text-sm text-slate-500">Small Business Owner</p>
          </div>
        </div>
      </div>
    </section>
  );
}