export default function Experience() {
  return (
    <section className="bg-[#f2f0f4] dark:bg-[#150a1f] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div
              className="aspect-square rounded-xl bg-cover bg-center shadow-lg"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKstGRWeRT8I5DoEEdOE6D3dU_BiLyzE8hVDvM_m0PhTnV2FHPGfeIiLl8oQMlDmdiZjgrtVnhWtuBchwYsWRp76-_4kxITwU4L4ARWpWxYD-RMkY7I9QZpeL9nUG7CMHHTHNBbfH-U4VO9DuUQCLxQGZD6JLTHnNIMqUmyjryge80On2ZWWpSrBChgycDSqvi_j1KMouCx4kqwoAlrUXRQUui5I0Cp4MXyK8DCJMr8o8f76OmJ0Th3uccqon6EVJ0JXOSnvKlhLQ")',
              }}
            />
            <div
              className="aspect-square rounded-xl bg-cover bg-center shadow-lg mt-8"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk41MGFcGJARYBULD2AMuUeeu-rYlixISa05pE22rMYkPVhvQLCbS_IT_arkl_3MZzk8xdDHltahTe4_uOEohjVkkSwwqtBJIffcYaLIeJtaXeMEPcZVYk0yxCC4CQQUHpyi8V_ff07i4c2CWfKpOHR50dipMYeCdVEMcT_A7OrY707YJETVE-FmM1U9yiPryGzc5t2NPfvf3yfl8AYEHF_rXNABDU6hKSjOEZwyTMjqRA7FLLeuSyBd39dmobg66NysnQ-khed4A")',
              }}
            />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-semibold mb-6">Designed for the next generation of protection.</h2>
            <p className="text-[#665a73] dark:text-[#a195ad] mb-8 leading-relaxed">
              We've reimagined insurance from the ground up. By focusing on two distinct life pillars—the companions we
              love and the families we build—we've created a more meaningful, intuitive experience.
            </p>

            <div className="flex gap-4">
              <button className="bg-[#ede6f4] dark:bg-[#2d1b42] text-[#140c1d] dark:text-white font-bold px-6 py-3 rounded-xl hover:opacity-80 transition-all">
                Learn More
              </button>
              <button className="text-primary font-bold px-6 py-3 flex items-center gap-2 group">
                View News{" "}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
