export default function Hero({ title, highlight, subtitle, bgImage }) {
  return (
    <section
      className="rounded-3xl min-h-[520px] flex flex-col items-center justify-center text-center p-8 relative"
      style={{
        backgroundImage:
          bgImage
            ? `linear-gradient(rgba(247,245,248,0.8), rgba(247,245,248,0.8)), url("${bgImage}")`
            : "linear-gradient(rgba(247,245,248,0.8), rgba(247,245,248,0.8))",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-black">
          {title || "—"}
          <br />
          <span className="text-primary">{highlight || ""}</span>
        </h1>

        <p className="text-lg text-slate-600">{subtitle || ""}</p>
      </div>
    </section>
  );
}
