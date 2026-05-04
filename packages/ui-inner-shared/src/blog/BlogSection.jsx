import { Link } from "react-router-dom";

function img(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || "";
}

export default function BlogSection({
  blogs = [],
  title = "Neueste Ratgeber",
  subtitle = "Blog",
  description = "Aktuelle Tipps, Informationen und hilfreiche Beiträge Ihrer Agentur.",
}) {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-surface-dark rounded-3xl">
      <div className="px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-primary">
            {subtitle}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-text-main dark:text-white mb-6">
            {title}
          </h2>

          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {blogs.map((blog, i) => (
            <Link
              key={blog.id || blog.slug || i}
              to={`/blogs/${blog.slug || blog.id}`}
              className="group bg-background-light dark:bg-background-dark rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="h-64 bg-primary/5 overflow-hidden">
                {img(blog) ? (
                  <img
                    src={img(blog)}
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
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">
                      newspaper
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-text-muted">
                    {blog.category_name || blog.category?.name || "Ratgeber"}
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4 line-clamp-2">
                  {blog.title}
                </h3>

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
      </div>
    </section>
  );
}