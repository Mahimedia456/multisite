import React from "react";

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-background-dark p-10 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary transition-colors group shadow-sm">
      <div className="bg-primary/20 size-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
        <span className="material-symbols-outlined text-primary group-hover:text-text-dark text-3xl">
          {icon}
        </span>
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}

export default function CoreValues() {
  return (
    <section className="bg-gray-100 dark:bg-zinc-900/50 py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Unsere Kernwerte</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Was uns antreibt, ist das Versprechen, Ihnen jederzeit als vertrauenswürdiger Partner zur Seite zu stehen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon="groups"
            title="Persönliche Beratung"
            desc="Mit über 8.000 Vertretungen sind wir deutschlandweit persönlich für Sie vor Ort – für individuelle Lösungen auf Augenhöhe."
          />
          <ValueCard
            icon="devices"
            title="Digitale Services"
            desc='Verwalten Sie Ihre Verträge 24/7 online über "Meine Allianz" – einfach, sicher und papierlos von überall auf der Welt.'
          />
          <ValueCard
            icon="verified_user"
            title="Transparente Leistungen"
            desc="Keine versteckten Klauseln. Wir setzen auf klare Bedingungen und faire Tarife, damit Sie genau wissen, worauf Sie sich verlassen können."
          />
        </div>
      </div>
    </section>
  );
}
