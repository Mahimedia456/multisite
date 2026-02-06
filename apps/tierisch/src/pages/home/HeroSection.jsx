import React from "react";
import Reveal from "../../components/Reveal";
import Card from "../../components/ui/Card";
import { ASSET_BASE } from "../../components/ui/helpers";

export default function HeroSection() {
  return (
    <section id="Startseite" className="relative w-full">
      <div
        className="relative min-h-[520px] w-full bg-slate-900"
        style={{
          backgroundImage: `url(${ASSET_BASE}/images/hero-sec.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="mx-auto flex min-h-[520px] w-full max-w-6xl items-center px-4 py-16">
          <Reveal>
            <Card className="relative w-full max-w-2xl p-8 md:p-10">
              <h1 className="text-2xl font-black leading-tight md:text-3xl">
                Du liebst dein Tier – wir sorgen dafür, dass es bestens geschützt ist.
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                Doch im unübersichtlichen Dschungel der Tierkrankenversicherungen den richtigen
                Schutz zu finden, ist oft eine Herausforderung.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {["Versteckte Klauseln", "Watezeiten und Ausschlüsse", "Unzählige Anbieter"].map(
                  (x) => (
                    <span
                      key={x}
                      className="rounded-full bg-[#E9FFFE] px-3 py-1 text-xs font-bold text-[#007C79]"
                    >
                      {x}
                    </span>
                  )
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#Angebot"
                  className="rounded-xl bg-[#00938F] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,147,143,0.25)] transition hover:-translate-y-0.5"
                >
                  Angebot anfordern
                </a>
                <a
                  href="#Über"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800 transition hover:-translate-y-0.5"
                >
                  Über Uns
                </a>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
