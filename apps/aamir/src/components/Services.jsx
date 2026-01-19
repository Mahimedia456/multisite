const services = [
  { title: "Managed Cloud", desc: "Secure and scalable cloud services" },
  { title: "Cybersecurity", desc: "Advanced threat protection" },
  { title: "Custom Software", desc: "Tailor-made solutions" },
  { title: "IT Consulting", desc: "Strategic technology advice" },
];

export default function Services() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(s => (
          <div key={s.title} className="bg-white p-4 rounded-xl border hover:shadow-xl">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <h3 className="text-primary font-bold">{s.title}</h3>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
