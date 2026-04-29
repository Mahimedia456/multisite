import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

export default function BrandUniquePagesIndex() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
   apiGet("/api/brands").then((res) => {
      setBrands(res?.data || []);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Brand Unique Pages</h1>

      <div className="grid grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="p-5 bg-white rounded-2xl shadow cursor-pointer hover:shadow-lg"
            onClick={() => navigate(`/brand-unique-pages/${b.id}`)}
          >
            <h2 className="font-bold text-lg">{b.name}</h2>
            <p className="text-sm text-gray-500">{b.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}