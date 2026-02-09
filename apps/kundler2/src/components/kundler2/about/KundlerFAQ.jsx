import { useState } from "react";
import MIcon from "../../MIcon";

const FAQS = [
  { q: "Wie finde ich eine Ansprechpartner:in vor Ort?", a: "Nutzen Sie die Suche und wählen Sie PLZ oder Ort. (Demo)" },
  { q: "Kann ich Schäden online melden?", a: "Ja – 24/7 über digitale Services oder telefonisch. (Demo)" },
  { q: "Gibt es Beratung auch digital?", a: "Ja, z. B. per Telefon oder Online-Services. (Demo)" },
  { q: "Wie finde ich passende Produkte?", a: "Wählen Sie einen Bereich und vergleichen Sie Optionen. (Demo)" },
];

function Item({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <span className="font-extrabold text-zinc-900">{q}</span>
        <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <MIcon name={open ? "remove" : "add"} className="text-primary text-[20px]" />
        </span>
      </button>

      {open && <div className="px-5 pb-5 text-zinc-600">{a}</div>}
    </div>
  );
}

export default function KundlerFAQ() {
  return (
    <section className="py-16 bg-[rgb(var(--bg-light))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">FAQ</h2>
            <p className="text-zinc-600 mt-2">Häufige Fragen – kurz & verständlich.</p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold text-zinc-900">
            Beratung & Kontakt <MIcon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {FAQS.map((f) => (
            <Item key={f.q} q={f.q} a={f.a} />
          ))}
        </div>

        <div className="sm:hidden mt-8">
          <button className="w-full bg-primary hover:bg-primary-dark text-zinc-900 px-5 py-3 rounded-full font-extrabold transition shadow-primary/20">
            Beratung & Kontakt
          </button>
        </div>
      </div>
    </section>
  );
}
