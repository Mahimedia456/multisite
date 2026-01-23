// apps/aamir/src/sections/team/Intro.jsx
export default function Intro({ id = "ansprechpartner", title = "Ihre Ansprechpartner", body = "" }) {
  return (
    <section id={id} className="py-12 bg-white dark:bg-[#152a28] rounded-3xl">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-[#111717] dark:text-white text-3xl lg:text-4xl font-bold leading-tight tracking-[-0.015em] mb-6">
          {title}
        </h2>
        <p className="text-[#111717] dark:text-gray-300 text-lg leading-relaxed">{body}</p>
      </div>
    </section>
  );
}
