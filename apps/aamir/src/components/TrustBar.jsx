export default function TrustBar() {
  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-8 w-32 bg-gray-300 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}
