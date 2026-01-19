import Icon from "../../ui/Icon";
export default function SecurityTrust() {
  return (
    <section className="bg-background-dark text-white rounded-3xl p-12">
      <h2 className="text-4xl font-bold mb-6">
        Your data is safe, encrypted, and private.
      </h2>
      <div className="flex gap-8">
        {["256-bit", "SOC2", "24/7"].map((t) => (
          <div key={t}>
            <span className="text-3xl font-black">{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
