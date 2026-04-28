import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <main className="bg-brand-cream">
      <Header />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black text-brand-green">Contact Us</p>
          <h1 className="mt-4 text-5xl font-black">Have questions? Connect with us.</h1>
          <p className="mt-5 text-zinc-600">
            This is a demo contact page for the DropBrand test site.
          </p>
        </div>

        <form className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border p-3" placeholder="First Name" />
            <input className="rounded-xl border p-3" placeholder="Last Name" />
            <input className="rounded-xl border p-3" placeholder="Phone" />
            <input className="rounded-xl border p-3" placeholder="Email" />
          </div>
          <textarea className="mt-4 w-full rounded-xl border p-3" rows="5" placeholder="Message" />
          <button className="mt-4 rounded-full bg-brand-accent px-6 py-3 font-black text-brand-dark">
            Submit Message
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}