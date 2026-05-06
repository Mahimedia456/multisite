import React, { useMemo } from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import PillDivider from "../../components/ui/PillDivider";
import SimpleTabs from "../../components/ui/SimpleTabs";
import { ASSET_BASE } from "../../components/ui/helpers";

import {
  BadgePercent,
  Banknote,
  HeartPulse,
  ClipboardList,
  Scan,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const ICON_MAP = {
  BadgePercent,
  Banknote,
  HeartPulse,
  ClipboardList,
  Scan,
  Sparkles,
  Stethoscope,
};

export default function LeistungTabsSection({
  title = "Leistungsübersicht – Tierisch Gut Versichert",
  items,
}) {
  const defaultTabs = useMemo(
    () => [
      {
        key: "kombis",
        label: "Kombinachlässe",
        icon: "BadgePercent",
        title: "Kombinationsrabatt: Sparen bei zwei Versicherungen",
        text:
          "Wenn du neben der Tierkrankenversicherung auch eine Tierhalterhaftpflichtversicherung abschließt, profitierst du von attraktiven Rabatten.",
        imageSrc: `${ASSET_BASE}/images/Kombinationsrabatt.webp`,
      },

      {
        key: "got",
        label: "4-facher GOT-Satz",
        icon: "Banknote",
        title: "Top-Leistungen – auch im Ernstfall",
        text:
          "Tierärztliche Behandlungen können teuer werden – besonders nachts oder im Notdienst.",
        imageSrc: `${ASSET_BASE}/images/4-facher-GOT-Satz-Notfallgebuhren-1.webp`,
      },

      {
        key: "reha",
        label: "Therapien & Reha",
        icon: "HeartPulse",
        title: "Therapien & Reha Maßnahmen",
        text:
          "Wir übernehmen Therapien wie Physiotherapie, Reha und Goldakupunktur.",
        imageSrc: `${ASSET_BASE}/images/Therapien-Reha-1.webp`,
      },

      {
        key: "rassen",
        label: "Rassenrisiken",
        icon: "ClipboardList",
        title: "Versicherung, die Unterschiede kennt",
        text:
          "Einige Rassen bringen besondere gesundheitliche Risiken mit.",
        imageSrc: `${ASSET_BASE}/images/Rassenspezifische-Erkrankungen-1.webp`,
      },

      {
        key: "diag",
        label: "Diagnostik",
        icon: "Scan",
        title: "Klarheit schafft Sicherheit",
        text:
          "MRT, CT, Röntgen oder Labor – moderne Diagnostik ist entscheidend.",
        imageSrc: `${ASSET_BASE}/images/Moderne-Diagnostik-1.webp`,
      },

      {
        key: "sofort",
        label: "Sofortschutz",
        icon: "Sparkles",
        title: "Sicherheit ab dem ersten Tag",
        text:
          "Für Welpen, Kitten und Fohlen gilt keine Wartezeit.",
        imageSrc: `${ASSET_BASE}/images/Sofortschutz-fur-Jungtiere-1.webp`,
      },

      {
        key: "wahl",
        label: "Tierarztwahl",
        icon: "Stethoscope",
        title: "Freie Tierarztwahl",
        text:
          "Freie Tierarzt- und Klinikwahl.",
        imageSrc: `${ASSET_BASE}/images/Freie-Tierarztwahl-1.webp`,
      },
    ],
    []
  );

  const tabs =
    Array.isArray(items) && items.length ? items : defaultTabs;

  const finalTabs = tabs.map((t) => ({
    ...t,
    Icon: ICON_MAP[t.icon] || BadgePercent,
  }));

  return (
    <SectionShell id="Leistungen" className="py-14">
      <Reveal>
        <h2 className="text-center text-2xl font-black text-slate-900">
          {title}
        </h2>
      </Reveal>

      <PillDivider />

      <Reveal delay={120}>
        <SimpleTabs items={finalTabs} />
      </Reveal>
    </SectionShell>
  );
}