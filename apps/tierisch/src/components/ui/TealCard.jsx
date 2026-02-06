import React from "react";
import { cx } from "./helpers";

export default function TealCard({ title, desc, className, icon }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl bg-[#00938F] p-6 text-white shadow-[0_12px_28px_rgba(0,147,143,0.25)]",
        className
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/10" />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold leading-snug">{title}</h3>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-xl">
            {icon}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-white/90">{desc}</p>
      </div>
    </div>
  );
}
