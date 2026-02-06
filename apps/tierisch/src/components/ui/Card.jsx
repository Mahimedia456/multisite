import React from "react";
import { cx } from "./helpers";

export default function Card({ className, children }) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
