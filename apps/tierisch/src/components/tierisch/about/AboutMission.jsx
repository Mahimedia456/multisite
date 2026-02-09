// src/components/tierisch/about/AboutMission.jsx
import MIcon from "../../MIcon";

function Card({ icon, title, children }) {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-zinc-100">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
        <MIcon name={icon} className="text-primary text-[30px]" />
      </div>
      <h3 className="text-2xl font-extrabold mb-4 text-zinc-900">{title}</h3>
      <p className="text-zinc-600 leading-relaxed">{children}</p>
    </div>
  );
}

export default function AboutMission() {
  return (
    <section id="mission" className="py-24 bg-[rgb(var(--background))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-zinc-900">
            Unsere Vision &amp; Mission
          </h2>
          <p className="text-zinc-600">
            Wir wollen Tierhalter in Deutschland entlasten – mit Transparenz,
            fairen Tarifen und einer digitalen Abwicklung, die im Alltag wirklich
            hilft.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card icon="visibility" title="Unsere Vision">
            Eine Welt, in der keine notwendige Behandlung am Geldbeutel
            scheitert. Jedes Haustier verdient die beste Versorgung – unabhängig
            von Rasse, Alter oder Budget.
          </Card>

          <Card icon="rocket_launch" title="Unsere Mission">
            Wir führen Tierhalter durch den Versicherungs-Dschungel:
            verständliche Leistungen, klare Bedingungen und schnelle Hilfe im
            Ernstfall – direkt, ehrlich und unkompliziert.
          </Card>
        </div>
      </div>
    </section>
  );
}
