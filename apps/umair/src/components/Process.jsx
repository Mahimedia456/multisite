export default function Process() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold">Simple 4-Step Process</h2>
          <div className="w-24 h-1 bg-accent mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="flex flex-col items-center text-center px-4 relative">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 z-10">
              1
            </div>
            <h4 className="font-bold mb-2">Choose Policy</h4>
            <p className="text-xs text-gray-500">Pick the plan that best fits your goals.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 relative">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 z-10">
              2
            </div>
            <h4 className="font-bold mb-2">Apply Online</h4>
            <p className="text-xs text-gray-500">15-minute digital application form.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 relative">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-6 z-10">
              3
            </div>
            <h4 className="font-bold mb-2">Quick Approval</h4>
            <p className="text-xs text-gray-500">Fast underwriting for most plans.</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 relative">
            <div className="w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center text-2xl font-bold mb-6 z-10">
              4
            </div>
            <h4 className="font-bold mb-2">Coverage Begins</h4>
            <p className="text-xs text-gray-500">You and your family are protected.</p>
          </div>

          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-primary/10 -z-0"></div>
        </div>
      </div>
    </section>
  );
}
