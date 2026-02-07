import React from "react";
import Reveal from "./Reveal";

export default function Stagger({
  children,
  from = 0,
  step = 80,
  y = 18,
  className = "",
}) {
  const arr = React.Children.toArray(children);

  return (
    <div className={className}>
      {arr.map((child, i) => (
        <Reveal key={i} delay={from + i * step} y={y}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
