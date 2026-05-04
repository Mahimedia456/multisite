import { useEffect, useState } from "react";

export default function BlogsPage({ brandSlug }) {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/public/${brandSlug}/blogs?search=${search}`)
      .then(res => res.json())
      .then(d => setBlogs(d.data));
  }, [search]);

  return (
    <div>
      <input onChange={e => setSearch(e.target.value)} />

      {blogs.map(b => (
        <div key={b.id}>{b.title}</div>
      ))}
    </div>
  );
}