export default function Hero({ title, subtitle, highlight, bgImage }) {
  const hasBg = typeof bgImage === "string" && bgImage.trim().length > 0;

  const style = hasBg
    ? {
        backgroundImage: `linear-gradient(rgba(247,245,248,0.80), rgba(247,245,248,0.80)), url("${bgImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(rgba(247,245,248,0.95), rgba(247,245,248,0.95))",
      };

  return (
    <section
      className="rounded-3xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 relative"
      style={style}
    >
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          {title ?? ""}
          <br />
          <span className="text-primary">{highlight ?? ""}</span>
        </h1>

        <p className="text-lg text-slate-600">{subtitle ?? ""}</p>
      </div>
    </section>
  );
}
