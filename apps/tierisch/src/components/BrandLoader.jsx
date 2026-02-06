import { useEffect, useState } from "react";

export default function BrandLoader({ duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Icon */}
        <div className="loader-icon">
          🐾
        </div>

        {/* subtle text */}
        <span className="text-xs tracking-wide text-gray-500">
          Bitte warten
        </span>
      </div>
    </div>
  );
}
