import Icon from "./Icon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-solid border-[#f0f2f4] dark:border-gray-800">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary dark:text-accent">
            <Icon name="verified_user" className="text-3xl" />
          </div>
          <h2 className="text-primary dark:text-white text-xl font-extrabold tracking-tight">
            TrustLife
          </h2>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a className="text-sm font-semibold hover:text-accent transition-colors" href="#products">
            Products
          </a>
          <a className="text-sm font-semibold hover:text-accent transition-colors" href="#planning">
            Planning
          </a>
          <a className="text-sm font-semibold hover:text-accent transition-colors" href="#why">
            Why Us
          </a>
          <a className="text-sm font-semibold hover:text-accent transition-colors" href="#support">
            Support
          </a>
        </nav>

        <button className="bg-primary dark:bg-accent text-white dark:text-primary px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition-all">
          Get a Quote
        </button>
      </div>
    </header>
  );
}
