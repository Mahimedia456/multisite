import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BlogDetailPage from "./BlogDetailPage.jsx";
import { useSharedBrandBlogDetail } from "./BrandBlogProvider.jsx";

function setMeta(blog) {
  if (!blog) return;

  const title = blog.seo_title || blog.og_title || blog.title;
  const description =
    blog.seo_description || blog.og_description || blog.excerpt || "";
  const image = blog.og_image || blog.featured_image || "";
  const canonical = blog.canonical_url || "";

  if (title) document.title = title;

  function upsertMeta(selector, attr, value) {
    if (!value) return;

    let el = document.querySelector(selector);

    if (!el) {
      el = document.createElement("meta");

      const property = selector.match(/property="([^"]+)"/)?.[1];
      const name = selector.match(/name="([^"]+)"/)?.[1];

      if (property) el.setAttribute("property", property);
      if (name) el.setAttribute("name", name);

      document.head.appendChild(el);
    }

    el.setAttribute(attr, value);
  }

  upsertMeta('meta[name="description"]', "content", description);
  upsertMeta('meta[property="og:title"]', "content", title);
  upsertMeta('meta[property="og:description"]', "content", description);
  upsertMeta('meta[property="og:image"]', "content", image);

  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }

    link.setAttribute("href", canonical);
  }
}

export default function BrandBlogDetailPage({ brandSlug }) {
  const { slug } = useParams();

  const { blog, related, loading, err } = useSharedBrandBlogDetail(
    brandSlug,
    slug
  );

  useEffect(() => {
    if (blog) setMeta(blog);
  }, [blog]);

  if (err) {
    return <BlogDetailPage blog={null} related={[]} loading={false} />;
  }

  return <BlogDetailPage blog={blog} related={related} loading={loading} />;
}