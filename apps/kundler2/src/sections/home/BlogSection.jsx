import { BrandBlogSection } from "@multisite/ui-inner-shared";

export default function BlogSection({ brandSlug = "kundler3", limit = 3 }) {
  return <BrandBlogSection brandSlug={brandSlug} limit={limit} />;
}