export async function getTenantConfig(slug) {
  if (slug === "aamir") {
    return {
      brandName: "Aamir PetCare",
      logoMark: "🐾",
      primary: "#2ec2b3",

      headerLinks: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Plans", href: "/#plans" },
        { label: "Claims", href: "/#claims" },
      ],

      loginUrl: "/login",
      ctaUrl: "/quote",
      ctaLabel: "Get Started",
    };
  }

  if (slug === "umair") {
    return {
      brandName: "Umair Trust Life",
      logoMark: "🛡️",
      primary: "#7300e6",
      // ...
    };
  }
}
s