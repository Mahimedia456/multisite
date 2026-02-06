import React from "react";
import { cx } from "./helpers";

export default function SectionShell({ id, className, children }) {
  return (
    <section id={id} className={cx("relative w-full", className)}>
      <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
    </section>
  );
}
