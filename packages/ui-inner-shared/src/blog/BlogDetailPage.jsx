import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1800&auto=format&fit=crop";

function getImage(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || FALLBACK_IMAGE;
}

function getCategory(blog) {
  return blog?.category_name || blog?.category?.name || blog?.category || "Ratgeber";
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

function normalizeHtml(value) {
  if (!value) return "<p>Kein Inhalt verfügbar.</p>";
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return `<p>${item}</p>`;
        if (item?.html) return item.html;
        if (item?.text) return `<p>${item.text}</p>`;
        if (item?.body) return `<p>${item.body}</p>`;
        if (item?.content) return normalizeHtml(item.content);
        return "";
      })
      .join("");
  }

  if (typeof value === "object") {
    if (value.html) return value.html;
    if (value.text) return `<p>${value.text}</p>`;
    if (value.body) return `<p>${value.body}</p>`;
    if (value.content) return normalizeHtml(value.content);
  }

  return "<p>Kein Inhalt verfügbar.</p>";
}

export default function BlogDetailPage({ blog = null, related = [], loading = false }) {
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-600">
          Blog wird geladen...
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Blogbeitrag nicht gefunden
          </h1>
          <Link
            to="/blogs"
            className="mt-6 inline-flex h-10 px-5 rounded-xl bg-primary text-white font-extrabold text-sm items-center"
          >
            Zurück zum Blog
          </Link>
        </div>
      </section>
    );
  }

  const html = normalizeHtml(blog.content || blog.body || blog.description);

  return (
    <>
      <section className="relative min-h-[560px] overflow-hidden bg-slate-950">
        <img
          src={getImage(blog)}
          alt={blog.title || "Blog"}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-slate-950/15" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Link
              to="/blogs"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white"
            >
              ← Zurück zum Blog
            </Link>

            <div className="text-[10px] uppercase tracking-widest font-extrabold text-white/70">
              {getCategory(blog)}
            </div>

            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight text-white">
              {blog.title}
            </h1>

            {blog.published_at || blog.created_at ? (
              <p className="mt-5 text-sm font-bold text-white/70">
                {formatDate(blog.published_at || blog.created_at)}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {blog.excerpt ? (
            <p className="text-2xl leading-relaxed text-slate-800 mb-10">
              {blog.excerpt}
            </p>
          ) : null}

          <div
            className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-slate-950 prose-p:text-slate-700 prose-p:leading-8 prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      {Array.isArray(related) && related.length > 0 ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
                Weitere Artikel
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-950">
                Diese Beiträge könnten Sie auch interessieren
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <article
                  key={item.id || item.slug}
                  className="rounded-[2.2rem] overflow-hidden border border-black/5 shadow-sm bg-white"
                >
                  <Link to={`/blogs/${item.slug || item.id}`}>
                    <img
                      src={getImage(item)}
                      alt={item.title || "Blog"}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-6">
                      <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
                        {getCategory(item)}
                      </div>
                      <h3 className="mt-2 font-extrabold text-lg leading-snug text-slate-950 line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}