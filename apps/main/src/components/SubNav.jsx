export default function SubNav() {
  return (
    <div className="w-full bg-[#fcfaff] dark:bg-[#1f142d] border-b border-[#ede6f4] dark:border-[#2d1b42]">
      <div className="max-w-[1200px] mx-auto px-6 py-2 flex justify-between items-center">
        <div className="flex gap-6">
          <a
            className="flex items-center gap-2 text-xs font-semibold text-[#665a73] dark:text-[#a195ad] hover:text-primary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            Track Claim
          </a>
          <a
            className="flex items-center gap-2 text-xs font-semibold text-[#665a73] dark:text-[#a195ad] hover:text-primary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">person_search</span>
            Find Agent
          </a>
          <a
            className="flex items-center gap-2 text-xs font-semibold text-[#665a73] dark:text-[#a195ad] hover:text-primary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Policy Documents
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          Quick Quote
        </div>
      </div>
    </div>
  );
}
