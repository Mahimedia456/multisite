import React, { useState } from "react";
import { cx } from "./helpers";

export default function FAQ({ items }) {
  const [open, setOpen] = useState(items?.[0]?.q ?? "");
  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {items.map((it) => {
          const isOpen = open === it.q;
          return (
            <button
              key={it.q}
              type="button"
              onClick={() => setOpen(isOpen ? "" : it.q)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="text-sm font-extrabold text-slate-900">{it.q}</div>
                <div
                  className={cx(
                    "grid h-8 w-8 place-items-center rounded-full border text-lg transition",
                    isOpen ? "border-[#00938F] text-[#00938F]" : "border-slate-200 text-slate-500"
                  )}
                >
                  {isOpen ? "−" : "+"}
                </div>
              </div>
              {isOpen ? (
                <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{it.a}</div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
