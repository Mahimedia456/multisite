import FAQ from "../../ui/FAQ";
import PillDivider from "../../ui/PillDivider";

const DEFAULT_ITEMS = [
  {
    q: "Wie schnell bekomme ich eine Antwort?",
    a: "In der Regel melden wir uns innerhalb eines Werktages zurück.",
  },
  {
    q: "Ist die Beratung kostenlos?",
    a: "Ja, die Beratung ist kostenlos und unverbindlich.",
  },
  {
    q: "Kann ich verschiedene Tarife vergleichen lassen?",
    a: "Ja, wir prüfen passende Optionen und erklären die Unterschiede verständlich.",
  },
];

export default function ContactFAQ({
  title = "Häufige Fragen zum Kontakt",
  items = DEFAULT_ITEMS,
}) {
  const faqItems = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <section className="py-20 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-black text-slate-900">
          {title}
        </h2>

        <PillDivider />

        <FAQ items={faqItems} />
      </div>
    </section>
  );
}