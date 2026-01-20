import { SiteHeader } from "@multisite/ui-inner-shared";

export default function Header() {
  return (
    <SiteHeader
      brand={{
        name: "PetCare+",
        logoType: "material",
        logoValue: "pets",
        homeLinks: [
          { label: "Plans", href: "/#plans" },
          { label: "How it Works", href: "/#how" },
          { label: "Claims", href: "/#claims" },
        ],
        login: { label: "Log In", to: "/login" },
        cta: { label: "Get a Quote" },
      }}
    />
  );
}
