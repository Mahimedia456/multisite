import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 18,
  once = true,
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          if (once) io.disconnect();
        } else if (!once) setShow(false);
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        show ? "opacity-100 blur-0" : "opacity-0 blur-[1px]",
        className,
      ].join(" ")}
    >
      <div style={!show ? { transform: `translateY(${y}px)` } : undefined}>
        {children}
      </div>
    </div>
  );
}
