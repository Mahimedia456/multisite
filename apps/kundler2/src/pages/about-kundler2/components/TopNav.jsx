import React from "react";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-[#eae4cd] dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="text-primary text-3xl">
                <svg
                  className="size-8"
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Allianz</h2>
            </div>

            <nav className="hidden xl:flex items-center gap-6">
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
                Auto, Haus &amp; Recht
              </a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
                Gesundheit &amp; Freizeit
              </a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
                Tier
              </a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
                Vorsorge &amp; Vermögen
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 items-center gap-2">
              <span className="material-symbols-outlined text-gray-500 text-sm">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-32 placeholder:text-gray-500"
                placeholder="Suchen"
                type="text"
              />
            </div>

            <button className="bg-primary text-text-dark font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
              Meine Allianz
            </button>
            <button className="bg-gray-100 dark:bg-gray-800 text-text-dark dark:text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Privatkunden
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
