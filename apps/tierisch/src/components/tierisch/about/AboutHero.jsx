// src/components/tierisch/about/AboutHero.jsx
import MIcon from "../../MIcon";

export default function AboutHero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/80 border border-zinc-200 text-primary font-bold text-xs uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Über uns
            </span>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-zinc-900">
              Weil wir Tiere genauso{" "}
              <span className="text-primary underline underline-offset-8 decoration-[rgba(var(--primary),.30)]">
                lieben
              </span>{" "}
              wie Sie.
            </h1>

            <p className="text-lg text-zinc-600 mb-8 max-w-xl">
              Tierisch Gut Versichert steht für verständliche Leistungen, digitale
              Abläufe und verlässlichen Schutz – damit Tierhalter in Deutschland
              medizinische Entscheidungen nach dem Tierwohl treffen können, nicht
              nach dem Preis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#mission"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all inline-flex items-center justify-center shadow-primary/20"
              >
                Unsere Mission
                <MIcon name="arrow_downward" className="ml-2 text-[20px]" />
              </a>

              <a
                href="#timeline"
                className="px-8 py-4 rounded-full font-bold border border-zinc-200 hover:bg-white transition-all text-zinc-800 inline-flex items-center justify-center"
              >
                Unsere Reise
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-2">
              <img
                alt="Happy Golden Retriever with owner"
                className="w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCog2AgjK4UKl1fe1jzKziFR08dQQVgUk6_T6Y5vQbziPZmJQ7i1MYcpPFh7BqPwzq6HJf_ukzVSWYCw5-bNcSRuMTMFeLKTtxxbAvoTE-UORiWoAu3zOdgEx9qbKOUSypb2ZUlNNXsf_wz3MEft_O67CD5IE4I9RWWRXHuuWVnvDuHrrKh_hX8LleaENpciZhtJ_CfUhpbl171bQr4LkDGVEmxElhg_Aw1JqPejf4ylZDYomadWtW3AZ3qvgu2EYqY_x5qoIWzh0A"
              />
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-15" />
          </div>
        </div>
      </div>
    </section>
  );
}
