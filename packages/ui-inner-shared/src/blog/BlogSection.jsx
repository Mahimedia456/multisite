import { useEffect, useState } from "react";

export default function BlogSection({ brandSlug }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`/public/${brandSlug}/blogs`)
      .then(res => res.json())
      .then(d => setBlogs(d.data.slice(0,3)));
  }, []);

  if (!blogs.length) return null;

  return (
    <div>
      {blogs.map(b => (
        <div key={b.id}>{b.title}</div>
      ))}
    </div>
  );
}