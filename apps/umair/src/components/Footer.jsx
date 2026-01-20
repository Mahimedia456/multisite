import { SiteFooter } from "@multisite/ui-inner-shared";
import Icon from "./Icon";

export default function Footer() {
  const LogoIcon = (props) => <Icon name="verified_user" {...props} />;

  return (
    <SiteFooter
      brand={{
        name: "TrustLife",
        LogoIcon,
        description:
          "Providing financial security and peace of mind to families across the nation for over five decades. Registered insurance provider #L-1928374.",
        socials: [
          { label: "🌐", href: "#" },
          { label: "↗", href: "#" },
          { label: "@", href: "#" },
        ],
        columns: [
          {
            title: "Solutions",
            links: [
              { label: "Term Life", href: "#" },
              { label: "Whole Life", href: "#" },
              { label: "Universal Life", href: "#" },
              { label: "Group Benefits", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "#" },
              { label: "Newsroom", href: "#" },
              { label: "Investors", href: "#" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Licensing", href: "#" },
              { label: "Disclosures", href: "#" },
            ],
          },
        ],
        bottomLeft: "© 2024 TrustLife Insurance Company. All rights reserved.",
        bottomRight: "Insurance products are issued by TrustLife Group (NAIC #23849).",
      }}
    />
  );
}
