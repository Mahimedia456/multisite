import MIcon from "../../MIcon";

function Row({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-primary/20">
        <MIcon name={icon} className="text-[20px]" />
      </div>
      <div>
        <h4 className="font-extrabold text-lg text-zinc-900">{title}</h4>
        <p className="text-zinc-600">{text}</p>
      </div>
    </div>
  );
}

const DEFAULT_ITEMS = [
  {
    icon: "verified",
    title: "Unabhängige Orientierung",
    text: "Wir erklären Leistungen verständlich und helfen, den passenden Schutz zu finden – ohne Fachchinesisch.",
  },
  {
    icon: "speed",
    title: "Schnelle Abwicklung",
    text: "Digitale Prozesse für Einreichung und Status – transparent und zeitsparend.",
  },
  {
    icon: "favorite",
    title: "Tierliebe im Fokus",
    text: "Hinter jedem Fall steht ein Familienmitglied. Wir handeln entsprechend – fair und menschlich.",
  },
];

export default function AboutTrust({
  title = "Warum Sie uns vertrauen können",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Xb9yaZMjiPvHTDJcjS7lf5dxZhbWbQZqVQ2O7jUXv0inptxFHRUWa3bFJdDi-GKG-OBviH5KoiwpezomSY3Ixu9P5tW5Zyl46wjkSj4LDJaFtHvDyIcSYSKE1A3vydqzkNS9_YaVKXcHk-7uG3sBvN__C_INynsyyNll1xz95Pnh81slNqk5wpKUOUU2b807e6pIxAmv3n5BH8zAbz727M3sE64GFnP7QhMqCHLrcSd5Ux5-CPC42LdF2cq58PT3zJUJmlF6b7g",
  items = DEFAULT_ITEMS,
}) {
  const list = Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              alt=""
              className="rounded-3xl shadow-xl border border-zinc-100"
              src={image}
            />
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-8 text-zinc-900">
              {title}
            </h2>

            <div className="space-y-6">
              {list.map((item) => (
                <Row
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}