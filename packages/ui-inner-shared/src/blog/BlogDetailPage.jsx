import { Link } from "react-router-dom";

function blogImage(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || "";
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogDetailPage({
  blog = null,
  related = [],
  loading = false,
}) {
  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-surface-dark rounded-3xl">
        <div className="px-6 text-text-muted">Blog wird geladen...</div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="py-24 bg-white dark:bg-surface-dark rounded-3xl">
        <div className="px-6">
          <h1 className="text-4xl font-bold text-text-main dark:text-white">
            Blogbeitrag nicht gefunden
          </h1>

          <Link
            to="/blogs"
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            Zurück zum Blog
          </Link>
        </div>
      </section>
    );
  }

  const image = blogImage(blog);

  return (
    <>
      <article className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden">
        <header className="relative min-h-[620px] flex items-end overflow-hidden rounded-3xl">
          {image ? (
            <img
              src={image}
              alt={blog.title || "Blog"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

          <div className="relative z-10 px-6 py-16 lg:py-24 max-w-4xl">
            <Link
              to="/blogs"
              className="mb-8 inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Zurück zum Blog
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white border border-white/20 w-fit mb-8">
              <span className="material-symbols-outlined text-sm text-secondary">
                newspaper
              </span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {blog.category_name || blog.category?.name || "Ratgeber"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              {blog.title}
            </h1>

            {blog.published_at || blog.created_at ? (
              <p className="mt-6 text-white/70 font-medium">
                {formatDate(blog.published_at || blog.created_at)}
              </p>
            ) : null}
          </div>
        </header>

        <div className="px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            {blog.excerpt ? (
              <p className="text-2xl text-text-muted leading-relaxed mb-12">
                {blog.excerpt}
              </p>
            ) : null}

            <div
              className="prose prose-lg max-w-none prose-headings:text-text-main prose-p:text-text-muted prose-a:text-primary"
              dangerouslySetInnerHTML={{
                __html:
                  blog.content ||
                  blog.body ||
                  blog.description ||
                  "<p>Kein Inhalt verfügbar.</p>",
              }}
            />
          </div>
        </div>
      </article>

      {Array.isArray(related) && related.length > 0 ? (
        <section className="py-24 md:py-32 bg-white dark:bg-surface-dark rounded-3xl mt-8">
          <div className="px-6">
            <h2 className="text-4xl font-bold text-text-main dark:text-white mb-12">
              Weitere Beiträge
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {related.map((item, i) => (
                <Link
                  key={item.id || item.slug || i}
                  to={`/blogs/${item.slug || item.id}`}
                  className="bg-background-light dark:bg-background-dark p-8 rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all"
                >
                  <p className="text-primary font-semibold text-base mb-3">
                    {item.category_name || item.category?.name || "Ratgeber"}
                  </p>

                  <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4 line-clamp-2">
                    {item.title}
                  </h3>

                  {item.excerpt ? (
                    <p className="text-text-muted leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}