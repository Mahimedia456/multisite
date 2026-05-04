import { Link } from "react-router-dom";

function blogImage(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || "";
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
  return (
    <>
      <header className="relative min-h-[520px] flex items-center overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        <div className="absolute inset-0 -z-10 bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_35%)]" />
        </div>

        <div className="relative z-10 w-full py-20 lg:py-28 px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white border border-white/20 w-fit mb-8">
              <span className="material-symbols-outlined text-sm text-secondary">
                auto_stories
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Ratgeber & Neuigkeiten
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
              Aktuelle <span className="text-primary">Blogbeiträge</span>.
            </h1>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Hilfreiche Informationen, Tipps und Neuigkeiten rund um Ihre
              Versicherung und Agentur.
            </p>
          </div>
        </div>
      </header>

      <section className="py-14 bg-white dark:bg-surface-dark rounded-3xl mt-8">
        <div className="px-6">
          <div className="grid gap-4 md:grid-cols-[1fr_280px]">
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Blog suchen..."
              className="h-14 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark px-5 text-sm text-text-main dark:text-white outline-none focus:border-primary"
            />

            <select
              value={category}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="h-14 rounded-2xl border border-primary/10 bg-background-light dark:bg-background-dark px-5 text-sm text-text-main dark:text-white outline-none focus:border-primary"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                  {cat.name || cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white dark:bg-surface-dark rounded-3xl mt-8">
        <div className="px-6">
          {loading ? (
            <div className="p-10 rounded-3xl bg-background-light dark:bg-background-dark text-text-muted">
              Blogs werden geladen...
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-10 rounded-3xl bg-background-light dark:bg-background-dark text-text-muted">
              Keine Blogbeiträge gefunden.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog, i) => (
                <Link
                  key={blog.id || blog.slug || i}
                  to={`/blogs/${blog.slug || blog.id}`}
                  className="group bg-background-light dark:bg-background-dark rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="h-64 bg-primary/5 overflow-hidden">
                    {blogImage(blog) ? (
                      <img
                        src={blogImage(blog)}
                        alt={blog.title || "Blog"}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-6xl">
                          article
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <p className="text-primary font-semibold text-base mb-3">
                      {blog.category_name || blog.category?.name || "Ratgeber"}
                    </p>

                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4 line-clamp-2">
                      {blog.title}
                    </h2>

                    {blog.excerpt ? (
                      <p className="text-text-muted leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-7 inline-flex items-center gap-2 text-primary font-bold">
                      Weiterlesen
                      <span className="material-symbols-outlined text-lg">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}