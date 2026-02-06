import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import SimpleTabs from "../../components/ui/SimpleTabs";
import { ASSET_BASE } from "../../components/ui/helpers";

// lucide icons
import {
  BadgePercent,
  Banknote,
  HeartPulse,
  ClipboardList,
  Scan,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function LeistungTabsSection() {
  const tabs = useMemo(
    () => [
      {
        key: "kombis",
        label: "Kombinachlässe",
        Icon: BadgePercent,
        title: "Kombinationsrabatt: Sparen bei zwei Versicherungen",
        text:
          "Wenn du neben der Tierkrankenversicherung auch eine Tierhalterhaftpflichtversicherung bei uns abschließt, profitierst du von einem attraktiven Rabatt auf beide Policen.",
        imageSrc: `${ASSET_BASE}/images/Kombinationsrabatt.webp`,
      },
      {
        key: "got",
        label: "4-facher GOT-Satz",
        Icon: Banknote,
        title: "Top-Leistungen – auch im Ernstfall",
        text:
          "Tierärztliche Behandlungen können teuer werden – besonders nachts, an Wochenenden oder im Notdienst.",
        imageSrc: `${ASSET_BASE}/images/4-facher-GOT-Satz-Notfallgebuhren-1.webp`,
      },
      {
        key: "reha",
        label: "Therapien & Reha",
        Icon: HeartPulse,
        title: "Therapien & Reha Maßnahmen",
        text:
          "Gesundheit endet nicht mit der Operation. Wir übernehmen auch Therapien wie Physiotherapie, Reha und Goldakupunktur.",
        imageSrc: `${ASSET_BASE}/images/Therapien-Reha-1.webp`,
      },
      {
        key: "rassen",
        label: "Rassenrisiken",
        Icon: ClipboardList,
        title: "Versicherung, die Unterschiede kennt",
        text:
          "Einige Rassen bringen besondere gesundheitliche Risiken mit. Unsere Tarife berücksichtigen das transparent und fair.",
        imageSrc: `${ASSET_BASE}/images/Rassenspezifische-Erkrankungen-1.webp`,
      },
      {
        key: "diag",
        label: "Diagnostik",
        Icon: Scan,
        title: "Klarheit schafft Sicherheit",
        text:
          "Ob MRT, CT, Röntgen oder Labor – moderne Diagnostik ist entscheidend. Wir sichern notwendige Untersuchungen ab.",
        imageSrc: `${ASSET_BASE}/images/Moderne-Diagnostik-1.webp`,
      },
      {
        key: "sofort",
        label: "Sofortschutz",
        Icon: Sparkles,
        title: "Sicherheit ab dem ersten Tag",
        text:
          "Für Welpen, Kitten und Fohlen gilt keine Wartezeit – der Schutz startet direkt ab dem ersten Tag.",
        imageSrc: `${ASSET_BASE}/images/Sofortschutz-fur-Jungtiere-1.webp`,
      },
      {
        key: "wahl",
        label: "Tierarztwahl",
        Icon: Stethoscope,
        title: "Freie Tierarztwahl",
        text:
          "Sie entscheiden, wo Ihr Tier behandelt wird – freie Tierarzt- und Klinikwahl. Ihr Lieblingstierarzt bleibt Ihre erste Adresse.",
        imageSrc: `${ASSET_BASE}/images/Freie-Tierarztwahl-1.webp`,
      },
    ],
    []
  );

  return (
    <SectionShell id="Leistungen" className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">
          Leistungsübersicht – Tierisch Gut Versichert
        </h2>
      </Reveal>

      <PillDivider />

      <Reveal delay={120}>
        <SimpleTabs items={tabs} />
      </Reveal>
    </SectionShell>
  );
}
