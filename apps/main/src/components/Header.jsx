export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#ede6f4] dark:border-[#2d1b42]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Insurance Holding</h1>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
            Solutions
          </a>
          <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
            About
          </a>
          <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">
            News
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-xl hover:opacity-90 transition-opacity">
            Contact Us
          </button>
          <div
            className="size-9 rounded-full bg-cover bg-center border border-[#ede6f4] dark:border-[#2d1b42]"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8HAIIiHDa5W-hTo9Wk_LRXStJGmwvJm2gw5-Szvh4E8Oc8RMytwEc3zeuDZluD1XWgP7UiWSAFK7h7nkcz3HU0ia1Bpx4EXX7CS2ncEzvjlK_xPn7TT7p4NxfZ2agJ3ayxt_TQaMlwuHPD67G-9KPTpV8i6lbi2DpvdZi2eLKBwGOTgNkjcY0MzrPGQ8V3S2nUbNtUGPmUVxIPa2BboVxGfZnZmunyBLeWaM0E-LuE8PnusQuybwT_DjseOFR0dAFjYKbYjTsqpg")',
            }}
          />
        </div>
      </div>
    </header>
  );
}
