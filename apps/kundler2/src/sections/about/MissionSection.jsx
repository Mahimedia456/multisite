const DEFAULT_VIDEO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC0NvsA8v_gkQmxGxHKH-KnxYY2IoSdqn7iJYz45harOKPO9lml1lRddXZjQldMMIo-wu4Z7154F_Xvjn7hhOsCezARhiTFW1euvCp9kBACSuNiA5Wq10jUGcMN0WZNWTVYkbZu2otu_Qa69uEyYIhxXirsrmC3hDxS91wpkiN3nbXZfIY5eFWaFs9QWGQia_1VIxhdsTr6o1V4xdLov4fFwZsetFi0jT9-xjN-mjbPhTfNQLPnS7V7FTGGWyu8VblomkZoA9YZPXU";

export default function MissionSection({
  eyebrow = "Unsere Mission",
  headline = "Beratung, Schutz und Vorsorge – passend zu Ihrem Leben",
  body = "Seit Generationen vertrauen Menschen auf die Stärke der Allianz. Wir verstehen uns nicht nur als Versicherer, sondern als lebenslanger Begleiter. In einer immer komplexeren Welt schaffen wir die Sicherheit, die Sie für Ihre Träume und Pläne brauchen.",
  note = "Erfahren Sie in 60 Sekunden, wie wir die Zukunft gestalten.",
  videoImage = DEFAULT_VIDEO_BG,
}) {
  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-4">
            {eyebrow}
          </h2>

          <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {headline}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
            {body}
          </p>

          <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
            <span className="material-symbols-outlined text-primary scale-125">
              info
            </span>
            <p className="text-sm font-medium">{note}</p>
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer aspect-video bg-gray-200 bg-cover bg-center"
          style={{ backgroundImage: `url('${videoImage}')` }}
        >
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/40">
            <div className="size-20 bg-primary rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-text-dark text-4xl">
                play_arrow
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}