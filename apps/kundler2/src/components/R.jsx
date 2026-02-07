import React from "react";
import Reveal from "./Reveal";

export default function R({ children, d = 0, y = 18, className = "" }) {
  return (
    <Reveal delay={d} y={y} className={className}>
      {children}
    </Reveal>
  );
}
