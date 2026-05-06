import { BrandBlogSection } from "@multisite/ui-inner-shared";

export default function BlogSection({ brandSlug, limit = 3 }) {
  return <BrandBlogSection brandSlug={brandSlug} limit={limit} />;
}