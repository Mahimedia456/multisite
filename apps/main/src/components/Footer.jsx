export default function Footer() {
  return (
    <footer className="border-t border-[#ede6f4] dark:border-[#2d1b42] py-12 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-3 text-primary opacity-50 grayscale">
            <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              />
            </svg>
            <span className="font-bold">Insurance Holding</span>
          </div>
          <p className="text-xs text-[#665a73] dark:text-[#a195ad]">
            Leading the future of specialized protection for pets and families globally.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a195ad]">Brands</span>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Aamir Pet Care
            </a>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Umair Family Legacy
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a195ad]">Company</span>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              About Us
            </a>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Leadership
            </a>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Careers
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a195ad]">Legal</span>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Privacy Policy
            </a>
            <a className="text-sm font-semibold hover:text-primary" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 pt-8 border-t border-[#ede6f4] dark:border-[#2d1b42] flex justify-between items-center text-[10px] text-[#a195ad]">
        <span>© 2024 Insurance Holding Company. All rights reserved.</span>
        <div className="flex gap-4">
          <a className="hover:text-primary transition-colors" href="#">
            Twitter
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
