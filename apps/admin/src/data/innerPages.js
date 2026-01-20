export const INNER_PAGES = [
  { id: "home", name: "Home Page", status: "published", modified: "Today, 09:20 AM" },
  { id: "about", name: "About Us", status: "draft", modified: "Yesterday, 05:10 PM" },
  { id: "services", name: "Services", status: "published", modified: "Nov 02, 2023 03:40 PM" },
  { id: "contact", name: "Contact Us", status: "published", modified: "Nov 01, 2023 11:05 AM" },
  { id: "get-quote", name: "Get a Quote", status: "draft", modified: "Today, 10:15 AM" },
  { id: "claims", name: "Claims", status: "draft", modified: "Today, 10:45 AM" },

  { id: "pricing", name: "Pricing", status: "published", modified: "Oct 28, 2023 02:05 PM" },
  { id: "plans", name: "Plans", status: "published", modified: "Oct 30, 2023 01:15 PM" },
  { id: "how-it-works", name: "How It Works", status: "published", modified: "Oct 29, 2023 09:00 AM" },
  { id: "why-us", name: "Why Us", status: "published", modified: "Nov 02, 2023 09:22 AM" },

  { id: "faq", name: "FAQ", status: "draft", modified: "Yesterday, 04:10 PM" },
  { id: "support", name: "Support Center", status: "published", modified: "Nov 03, 2023 12:10 PM" },
  { id: "claim-guide", name: "How to Claim", status: "published", modified: "Nov 01, 2023 02:30 PM" },

  { id: "careers", name: "Careers", status: "published", modified: "Oct 22, 2023 04:40 PM" },
  { id: "blog", name: "Blog", status: "published", modified: "Nov 02, 2023 06:10 PM" },
  { id: "press", name: "Press", status: "published", modified: "Oct 12, 2023 09:00 AM" },

  { id: "privacy", name: "Privacy Policy", status: "published", modified: "Nov 03, 2023 12:10 PM" },
  { id: "terms", name: "Terms of Service", status: "published", modified: "Nov 02, 2023 09:22 AM" },
  { id: "licensing", name: "Licensing", status: "published", modified: "Oct 20, 2023 10:35 AM" },
  { id: "disclosures", name: "Disclosures", status: "published", modified: "Oct 19, 2023 08:50 AM" },
];

// ✅ sections per page (for the detail screen)
export const INNER_PAGE_SECTIONS = {
  home: [
    { id: "hero", name: "Hero", type: "HeroBlock", status: "published" },
    { id: "benefits", name: "Benefits", type: "IconGrid", status: "published" },
    { id: "cta", name: "Final CTA", type: "CallToAction", status: "draft" },
  ],
  about: [
    { id: "hero", name: "Hero", type: "HeroBlock", status: "published" },
    { id: "story", name: "Our Story", type: "RichText", status: "draft" },
    { id: "team", name: "Leadership", type: "TeamGrid", status: "published" },
  ],
  services: [
    { id: "hero", name: "Hero", type: "HeroBlock", status: "published" },
    { id: "service-list", name: "Service List", type: "Cards", status: "published" },
  ],
  contact: [
    { id: "hero", name: "Hero", type: "HeroBlock", status: "published" },
    { id: "form", name: "Contact Form", type: "Form", status: "draft" },
    { id: "map", name: "Map Section", type: "MapEmbed", status: "published" },
  ],
};
