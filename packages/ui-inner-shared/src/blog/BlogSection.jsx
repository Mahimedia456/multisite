import { Link } from "react-router-dom";

function getBlogUrl(blog) {
  return `/blogs/${blog?.slug || blog?.id}`;
}

export default function BlogSection({
  blogs = [],
  title = "Neueste Blogbeiträge",
  subtitle = "Ratgeber",
  description = "Aktuelle Informationen und hilfreiche Tipps Ihrer Agentur.",
}) {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  return (
    <section className="bg-[#F6F8FB] px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            {subtitle}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {title}
          </h2>

          {description ? (
            <p className="mt-4 text-base leading-7 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

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

                <h3 className="line-clamp-2 text-xl font-bold text-slate-950">
                  {blog.title}
                </h3>

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
      </div>
    </section>
  );
}