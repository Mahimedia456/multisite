import BlogSection from "./BlogSection.jsx";
import { useSharedBrandBlogs } from "./BrandBlogProvider.jsx";

export default function BrandBlogSection({
  brandSlug,
  limit = 3,
  title = "Neueste Blogbeiträge",
  subtitle = "Ratgeber",
  description = "Aktuelle Informationen und hilfreiche Tipps Ihrer Agentur.",
}) {
  const { blogs, loading, err } = useSharedBrandBlogs(brandSlug, { limit });

  if (loading) return null;
  if (err || !blogs.length) return null;

  return (
    <BlogSection
      blogs={blogs}
      title={title}
      subtitle={subtitle}
      description={description}
    />
  );
}