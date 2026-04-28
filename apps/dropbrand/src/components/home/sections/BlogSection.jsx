const posts = [
  "How to choose the right insurance plan for your family",
  "5 common insurance mistakes and how to avoid them",
  "Health insurance explained: what your policy really covers",
];

export default function BlogSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest text-primary">Latest blogs</p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">Latest news, guides and updates</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p} className="overflow-hidden rounded-[2rem] bg-background-light shadow-sm">
              <img
                src={`https://images.unsplash.com/photo-${[
                  "1551836022-d5d88e9218df",
                  "1554224155-6726b3ff858f",
                  "1521791136064-7986c2920216",
                ][i]}?q=80&w=900`}
                alt=""
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-black leading-snug">{p}</h3>
                <button className="mt-5 text-sm font-black text-primary">Read more →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}