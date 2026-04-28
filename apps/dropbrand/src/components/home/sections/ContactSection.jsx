export default function ContactSection() {
  return (
    <section className="bg-primary-dark py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-accent">Contact us today</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Have questions? Connect with us for support
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Connect with our experts and experience seamless assistance every step of the way.
          </p>

          <div className="mt-8 rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-white/60">Phone Number</p>
            <a className="mt-1 block text-2xl font-black text-accent" href="tel:+49000000000">
              +49 000 000 000
            </a>
          </div>
        </div>

        <form className="rounded-[2rem] bg-white p-8 text-slate-900 shadow-2xl">
          <h3 className="text-3xl font-black">Get in Touch</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="rounded-2xl border p-4 outline-none focus:border-primary" placeholder="First Name" />
            <input className="rounded-2xl border p-4 outline-none focus:border-primary" placeholder="Last Name" />
            <input className="rounded-2xl border p-4 outline-none focus:border-primary" placeholder="Phone" />
            <input className="rounded-2xl border p-4 outline-none focus:border-primary" placeholder="Email" />
          </div>
          <textarea className="mt-4 w-full rounded-2xl border p-4 outline-none focus:border-primary" rows="4" placeholder="Message" />
          <button className="mt-5 rounded-full bg-accent px-6 py-3 text-sm font-black text-primary-dark">
            Submit Message
          </button>
        </form>
      </div>
    </section>
  );
}