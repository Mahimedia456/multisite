export default function Hero(props) {
  const {
    title,
    highlight,
    subtitle,
    bgImage,
    tenant, // optional fallback
  } = props || {};

  const fallback = tenant?.about?.hero || {};
  const finalTitle = title ?? fallback.title ?? "Built on trust.";
  const finalHighlight = highlight ?? fallback.highlight ?? "Focused on what matters.";
  const finalSubtitle =
    subtitle ?? fallback.subtitle ?? "Experience premium insurance solutions tailored for your family.";

  const image =
    bgImage ??
    fallback.bgImage ??
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80";

  return (
    <section
      className="rounded-3xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(247,245,248,0.82), rgba(247,245,248,0.82)), url("${image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          {finalTitle}
          <br />
          <span className="text-primary">{finalHighlight}</span>
        </h1>

        <p className="text-lg text-slate-600">{finalSubtitle}</p>
      </div>
    </section>
  );
}
