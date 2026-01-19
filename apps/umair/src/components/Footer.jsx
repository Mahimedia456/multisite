import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Icon name="verified_user" className="text-primary dark:text-accent" />
              <h2 className="text-primary dark:text-white text-xl font-extrabold tracking-tight">
                TrustLife
              </h2>
            </div>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Providing financial security and peace of mind to families across the nation for over five decades.
              Registered insurance provider #L-1928374.
            </p>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary dark:text-white">
                <Icon name="public" className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary dark:text-white">
                <Icon name="share" className="text-sm" />
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary dark:text-white">
                <Icon name="alternate_email" className="text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary dark:text-white text-sm uppercase tracking-widest">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a className="hover:text-accent" href="#">Term Life</a></li>
              <li><a className="hover:text-accent" href="#">Whole Life</a></li>
              <li><a className="hover:text-accent" href="#">Universal Life</a></li>
              <li><a className="hover:text-accent" href="#">Group Benefits</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary dark:text-white text-sm uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a className="hover:text-accent" href="#">About Us</a></li>
              <li><a className="hover:text-accent" href="#">Careers</a></li>
              <li><a className="hover:text-accent" href="#">Newsroom</a></li>
              <li><a className="hover:text-accent" href="#">Investors</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-primary dark:text-white text-sm uppercase tracking-widest">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a className="hover:text-accent" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-accent" href="#">Terms of Service</a></li>
              <li><a className="hover:text-accent" href="#">Licensing</a></li>
              <li><a className="hover:text-accent" href="#">Disclosures</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2024 TrustLife Insurance Company. All rights reserved.</p>
          <p>Insurance products are issued by TrustLife Group (NAIC #23849).</p>
        </div>
      </div>
    </footer>
  );
}
