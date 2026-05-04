import { Link } from "react-router-dom";

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
      <section className="bg-[#F6F8FB] px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          Blog wird geladen...
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="bg-[#F6F8FB] px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            Blogbeitrag nicht gefunden
          </h1>
          <Link
            to="/blogs"
            className="mt-6 inline-flex rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Zurück zum Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="bg-[#F6F8FB] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/blogs"
          className="mb-8 inline-flex text-sm font-semibold text-blue-700"
        >
          ← Zurück zum Blog
        </Link>

        <div className="overflow-hidden rounded-[36px] bg-white shadow-sm">
          {blog.featured_image || blog.og_image ? (
            <img
              src={blog.featured_image || blog.og_image}
              alt={blog.title || "Blog"}
              className="h-[320px] w-full object-cover md:h-[460px]"
            />
          ) : null}

          <div className="p-8 md:p-12">
            {blog.category_name || blog.category?.name ? (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {blog.category_name || blog.category?.name}
              </p>
            ) : null}

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              {blog.title}
            </h1>

            {blog.published_at || blog.created_at ? (
              <p className="mt-4 text-sm text-slate-500">
                {formatDate(blog.published_at || blog.created_at)}
              </p>
            ) : null}

            {blog.excerpt ? (
              <p className="mt-8 text-xl leading-8 text-slate-600">
                {blog.excerpt}
              </p>
            ) : null}

            <div
              className="prose prose-slate mt-10 max-w-none prose-headings:text-slate-950 prose-a:text-blue-700"
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

        {Array.isArray(related) && related.length > 0 ? (
          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-slate-950">
              Weitere Beiträge
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/blogs/${item.slug || item.id}`}
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                    {item.title}
                  </h3>

                  {item.excerpt ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.excerpt}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}