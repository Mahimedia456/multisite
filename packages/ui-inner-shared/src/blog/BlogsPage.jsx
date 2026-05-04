import { Link } from "react-router-dom";

function getBlogUrl(blog) {
  return `/blogs/${blog?.slug || blog?.id}`;
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
    <section className="bg-[#F6F8FB] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[32px] bg-white p-8 shadow-sm md:p-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Blog
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Aktuelle Beiträge
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Informationen, Tipps und Neuigkeiten Ihrer Allianz Agentur.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_280px]">
          <input
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Blog suchen..."
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                {cat.name || cat.title}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-slate-500 shadow-sm">
            Blogs werden geladen...
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-slate-500 shadow-sm">
            Keine Blogbeiträge gefunden.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.id || blog.slug}
                to={getBlogUrl(blog)}
                className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  {blog.featured_image || blog.og_image ? (
                    <img
                      src={blog.featured_image || blog.og_image}
                      alt={blog.title || "Blog"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      Kein Bild
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {blog.category_name || blog.category?.name ? (
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                      {blog.category_name || blog.category?.name}
                    </p>
                  ) : null}

                  <h2 className="line-clamp-2 text-xl font-bold text-slate-950">
                    {blog.title}
                  </h2>

                  {blog.excerpt ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {blog.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-5 text-sm font-semibold text-blue-700">
                    Weiterlesen →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}