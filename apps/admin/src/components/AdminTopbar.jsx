import MIcon from "./MIcon";

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#f6f2fb]/80 backdrop-blur border-b border-[#efeaf6]">
      <div className="px-7 h-[76px] flex items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-6 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 shrink-0">
            Overview
          </h1>

          <div className="hidden md:flex items-center gap-3 bg-white/80 border border-[#efeaf6] rounded-full px-4 h-11 w-[360px] max-w-full shadow-sm">
            <MIcon name="search" className="text-gray-400 text-[20px]" />
            <input
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
              placeholder="Global Search"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:block text-sm font-semibold text-violet-700">
            Wednesday, Jan 24, 2024
          </div>

          <button className="w-10 h-10 rounded-full bg-white/80 border border-[#efeaf6] shadow-sm flex items-center justify-center">
            <MIcon name="notifications" className="text-[20px] text-gray-700" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/80 border border-[#efeaf6] shadow-sm flex items-center justify-center">
            <MIcon name="person" className="text-[22px] text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
}
