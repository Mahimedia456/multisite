import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop";

function getImage(blog) {
  return blog?.featured_image || blog?.og_image || blog?.image?.url || FALLBACK_IMAGE;
}

function getCategory(blog) {
  return blog?.category_name || blog?.category?.name || blog?.category || "Ratgeber";
}

export default function BlogSection({
  blogs = [],
  title = "Lesen lohnt sich: Ratgeber & Insights",
  subtitle = "Tipps der Redaktion",
  description = "",
}) {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  return (
    <section className="py-16 bg-white" id="insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-widest font-extrabold text-black/60">
            {subtitle}
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-950">
            {title}
          </h2>

          {description ? (
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
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
      </div>
    </section>
  );
}