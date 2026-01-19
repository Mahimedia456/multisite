import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-900">
              PetCare+
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" href="/#plans">
              Plans
            </a>

            <a className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" href="/#how">
              How it Works
            </a>

            {/* ✅ THIS MUST GO TO ROUTE */}
            <Link
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              to="/about"
            >
              About Us
            </Link>

            <a className="text-sm font-medium text-gray-500 hover:text-primary transition-colors" href="/#claims">
              Claims
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            <Link
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
              to="/login"
            >
              Log In
            </Link>

            <button className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
              Get a Quote
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
