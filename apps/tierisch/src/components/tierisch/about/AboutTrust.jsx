// src/components/tierisch/about/AboutTrust.jsx
import MIcon from "../../MIcon";

function Row({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-primary/20">
        <MIcon name={icon} className="text-[20px]" />
      </div>
      <div>
        <h4 className="font-extrabold text-lg text-zinc-900">{title}</h4>
        <p className="text-zinc-600">{text}</p>
      </div>
    </div>
  );
}

export default function AboutTrust() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              alt="Happy dog with vet"
              className="rounded-3xl shadow-xl border border-zinc-100"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Xb9yaZMjiPvHTDJcjS7lf5dxZhbWbQZqVQ2O7jUXv0inptxFHRUWa3bFJdDi-GKG-OBviH5KoiwpezomSY3Ixu9P5tW5Zyl46wjkSj4LDJaFtHvDyIcSYSKE1A3vydqzkNS9_YaVKXcHk-7uG3sBvN__C_INynsyyNll1xz95Pnh81slNqk5wpKUOUU2b807e6pIxAmv3n5BH8zAbz727M3sE64GFnP7QhMqCHLrcSd5Ux5-CPC42LdF2cq58PT3zJUJmlF6b7g"
            />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 text-zinc-900">
              Warum Sie uns vertrauen können
            </h2>

            <div className="space-y-6">
              <Row
                icon="verified"
                title="Unabhängige Orientierung"
                text="Wir erklären Leistungen verständlich und helfen, den passenden Schutz zu finden – ohne Fachchinesisch."
              />
              <Row
                icon="speed"
                title="Schnelle Abwicklung"
                text="Digitale Prozesse für Einreichung und Status – transparent und zeitsparend."
              />
              <Row
                icon="favorite"
                title="Tierliebe im Fokus"
                text="Hinter jedem Fall steht ein Familienmitglied. Wir handeln entsprechend – fair und menschlich."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
