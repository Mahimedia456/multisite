export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                🐾
              </div>
              <div className="font-extrabold text-sm">PetCare+</div>
            </div>

            <p className="mt-4 text-xs text-gray-500 max-w-sm leading-relaxed">
              We're on a mission to make pet care affordable and accessible for everyone. Because pets are family.
            </p>

            <div className="mt-5 flex gap-3">
              <a className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-xs" href="#">
                f
              </a>
              <a className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-xs" href="#">
                ig
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><a className="hover:text-primary" href="#">About Us</a></li>
              <li><a className="hover:text-primary" href="#">Careers</a></li>
              <li><a className="hover:text-primary" href="#">Press</a></li>
              <li><a className="hover:text-primary" href="#">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><a className="hover:text-primary" href="#">Support Center</a></li>
              <li><a className="hover:text-primary" href="#">How to Claim</a></li>
              <li><a className="hover:text-primary" href="#">Dog Breeds</a></li>
              <li><a className="hover:text-primary" href="#">Cat Breeds</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-xs text-gray-500">
              <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary" href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-[10px] text-gray-400">
            © 2023 PetCare+ Insurance Services. All rights reserved.
          </div>
          <div className="text-[10px] text-gray-400">
            Underwritten by United States Fire Insurance Company.
          </div>
        </div>
      </div>
    </footer>
  );
}
