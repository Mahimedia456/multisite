import { Link } from "react-router-dom";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1800&auto=format&fit=crop";

function getImage(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || FALLBACK_HERO;
}

function getCategory(blog) {
  return blog?.category_name || blog?.category?.name || blog?.category || "Ratgeber";
}

export default function BlogsPage({
  blogs = [],
  categories = [],
  loading = false,
  search = "",
  category = "",
  onSearchChange,
  onCategoryChange,
}) {
  const heroImage = getImage(blogs?.[0]);

  return (
    <>
      <section className="relative min-h-[500px] overflow-hidden bg-slate-950">
        <img
          src={heroImage}
          alt="Blog"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/10" />

        <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/70">
              Ratgeber & Neuigkeiten
            </div>

            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight text-white">
              Aktuelle <span className="text-primary">Blogbeiträge</span>
            </h1>

            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-white/90">
              Hilfreiche Informationen, Tipps und Neuigkeiten rund um Ihre
              Versicherung und Agentur.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-[1fr_300px]">
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Blog suchen..."
              className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-primary"
            />

            <select
              value={category}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-primary"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((cat, i) => (
                <option key={cat.id || cat.slug || i} value={cat.slug || cat.id || cat.name}>
                  {cat.name || cat.title || cat.slug}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
              Tipps der Redaktion
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-950">
              Lesen lohnt sich: Ratgeber & Insights
            </h2>
          </div>

          {loading ? (
            <p className="mt-10 text-slate-600">Blogs werden geladen...</p>
          ) : blogs.length === 0 ? (
            <p className="mt-10 text-slate-600">Keine Blogbeiträge gefunden.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article
                  key={blog.id || blog.slug}
                  className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm bg-white"
                >
                  <Link to={`/blogs/${blog.slug || blog.id}`}>
                    <img
                      src={getImage(blog)}
                      alt={blog.title || "Blog"}
                      className="w-full h-56 object-cover"
                    />

                    <div className="p-6">
                      <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
                        {getCategory(blog)}
                      </div>

                      <h3 className="mt-2 font-extrabold text-lg leading-snug text-slate-950 line-clamp-2">
                        {blog.title}
                      </h3>

                      {blog.excerpt ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-5 inline-flex h-10 px-5 rounded-xl bg-primary text-white font-extrabold text-sm items-center hover:opacity-90">
                        Mehr lesen
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}