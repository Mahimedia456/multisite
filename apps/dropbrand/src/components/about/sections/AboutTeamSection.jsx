export default function AboutTeamSection({
  eyebrow = "Unser Team",
  headline = "Menschen, die Versicherung persönlich machen",
  members = [
    {
      name: "Anna Weber",
      role: "Versicherungsberaterin",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
    },
    {
      name: "Markus Klein",
      role: "Schadenservice Experte",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
    },
    {
      name: "Sofia Brandt",
      role: "Kundenbetreuung",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
    },
  ],
}) {
  return (
    <section className="bg-white px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </div>

          <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            {headline}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {members.map((member, idx) => (
            <div key={idx} className="overflow-hidden rounded-[2rem] bg-background-light">
              <img
                src={member.image}
                alt={member.name}
                className="h-[360px] w-full object-cover"
              />

              <div className="p-7">
                <h3 className="text-2xl font-black text-slate-950">
                  {member.name}
                </h3>
                <p className="mt-2 font-semibold text-primary">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}