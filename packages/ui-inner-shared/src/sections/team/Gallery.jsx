// apps/aamir/src/sections/team/Gallery.jsx
export default function Gallery({ id = "impressionen", title = "Impressionen aus der Agentur", images = [] }) {
  const [a, b, c] = images;

  return (
    <section id={id} className="py-16 bg-white dark:bg-[#11211f] rounded-3xl">
      <div>
        <h2 className="text-[#111717] dark:text-white text-3xl font-bold mb-8 text-center lg:text-left">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          <div className="md:col-span-2 h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {a?.url ? (
              <img alt={a?.alt || "Gallery image"} src={a.url} className="w-full h-full object-cover" />
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-1/2 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {b?.url ? (
                <img alt={b?.alt || "Gallery image"} src={b.url} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="h-1/2 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {c?.url ? (
                <img alt={c?.alt || "Gallery image"} src={c.url} className="w-full h-full object-cover" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
