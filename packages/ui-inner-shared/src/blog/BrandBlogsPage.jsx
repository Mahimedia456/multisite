import { useState } from "react";
import BlogsPage from "./BlogsPage.jsx";
import {
  useSharedBrandBlogs,
  useSharedBrandBlogCategories,
} from "./BrandBlogProvider.jsx";

export default function BrandBlogsPage({ brandSlug }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const {
    blogs,
    loading: blogsLoading,
    err: blogsErr,
  } = useSharedBrandBlogs(brandSlug, {
    search,
    category,
    limit: 100,
  });

  const {
    categories,
    loading: categoriesLoading,
    err: categoriesErr,
  } = useSharedBrandBlogCategories(brandSlug);

  if (blogsErr || categoriesErr) {
    return null;
  }

  return (
    <BlogsPage
      blogs={blogs}
      categories={categories}
      loading={blogsLoading || categoriesLoading}
      search={search}
      category={category}
      onSearchChange={setSearch}
      onCategoryChange={setCategory}
    />
  );
}