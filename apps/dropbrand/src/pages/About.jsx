import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <main className="bg-brand-cream">
      <Header />
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm font-black text-brand-green">About DropBrand</p>
        <h1 className="mt-4 text-5xl font-black">A demo insurance brand for builder testing.</h1>
        <p className="mt-6 text-lg text-zinc-600">
          This page is static for now. Later we will connect it to the same draggable
          section builder and versioned JSON system.
        </p>
      </section>
      <Footer />
    </main>
  );
}