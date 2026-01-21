export default function Footer(props) {
  const { copyright, links } = props || {};

  const c = copyright || "© 2024 Insurance Holding";
  const l = Array.isArray(links) && links.length ? links : ["Privacy", "Terms"];

  return (
    <footer className="border-t py-16 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex justify-between gap-6 flex-wrap">
        <span>{c}</span>
        <span>{l.join(" · ")}</span>
      </div>
    </footer>
  );
}
