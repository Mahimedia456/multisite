export default function SecurityTrust({ title, items }) {
  const list = Array.isArray(items) ? items : [];

  return (
    <section className="bg-background-dark text-white rounded-3xl p-12">
      <h2 className="text-4xl font-bold mb-6">{title || ""}</h2>

      <div className="flex gap-8 flex-wrap">
        {list.map((t) => (
          <div key={t}>
            <span className="text-3xl font-black">{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
