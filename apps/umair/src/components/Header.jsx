import { SiteHeader } from "@multisite/ui-inner-shared";
import Icon from "./Icon";

export default function Header() {
  const LogoIcon = (props) => <Icon name="verified_user" {...props} />;

  return (
    <SiteHeader
      brand={{
        name: "TrustLife",
        LogoIcon,
        homeLinks: [
          { label: "Products", href: "/#products" },
          { label: "Planning", href: "/#planning" },
          { label: "Why Us", href: "/#why" },
          { label: "Support", href: "/#support" },
        ],
        login: { label: "Log In", to: "/login" },
        cta: { label: "Get a Quote" },
      }}
    />
  );
}
