import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogDetailPage({ brandSlug }) {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`/public/${brandSlug}/blogs/${slug}`)
      .then(res => res.json())
      .then(d => {
        setBlog(d.data);
        setRelated(d.related);
      });
  }, []);

  if (!blog) return null;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.excerpt}</p>

      <h3>Related</h3>
      {related.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}