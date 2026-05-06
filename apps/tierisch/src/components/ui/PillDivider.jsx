import React from "react";

export default function PillDivider() {
  return (
    <div className="mx-auto my-4 flex w-full max-w-md items-center justify-center gap-3">
      <span className="h-px w-full bg-slate-200" />

      <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/20 bg-primary/10 text-[18px]">
        🐾
      </span>

      <span className="h-px w-full bg-slate-200" />
    </div>
  );
}