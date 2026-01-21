import { SiteFooter } from "@multisite/ui-inner-shared";
import { useBrandLayout } from "../lib/useBrandLayout";

const FALLBACK = {
  name: "PetCare+",
  logoType: "emoji",
  logoValue: "🐾",
  description:
    "We're on a mission to make pet care affordable and accessible for everyone. Because pets are family.",
  socials: [
    { label: "f", href: "#" },
    { label: "ig", href: "#" },
  ],
  columns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Support Center", href: "#" },
        { label: "How to Claim", href: "#" },
        { label: "Dog Breeds", href: "#" },
        { label: "Cat Breeds", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Accessibility", href: "#" },
      ],
    },
  ],
  bottomLeft: "© 2023 PetCare+ Insurance Services. All rights reserved.",
  bottomRight: "Underwritten by United States Fire Insurance Company.",
};

export default function Footer() {
  const { footer } = useBrandLayout("umair"); // ✅ brand slug

  return <SiteFooter brand={footer || FALLBACK} />;
}
