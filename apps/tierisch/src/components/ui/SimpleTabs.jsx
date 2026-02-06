import React, { useMemo, useRef, useState } from "react";
import Card from "./Card";
import { cx } from "./helpers";

export default function SimpleTabs({ items = [] }) {
  const [active, setActive] = useState(items?.[0]?.key ?? "");
  const scrollerRef = useRef(null);

  const current = useMemo(() => {
    return items.find((x) => x.key === active) ?? items[0];
  }, [active, items]);

  // mouse drag scroll (desktop)
  const drag = useRef({ down: false, x: 0, left: 0 });
  const onMouseDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current.down = true;
    drag.current.x = e.pageX;
    drag.current.left = el.scrollLeft;
  };
  const onMouseLeave = () => (drag.current.down = false);
  const onMouseUp = () => (drag.current.down = false);
  const onMouseMove = (e) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    e.preventDefault();
    const dx = e.pageX - drag.current.x;
    el.scrollLeft = drag.current.left - dx;
  };

  return (
    <div className="mt-6">
      {/* TABS BAR */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className={cx(
            "flex w-full items-center gap-2",
            "overflow-x-auto overflow-y-hidden",
            "whitespace-nowrap pb-2",
            "scroll-smooth",
            "cursor-grab active:cursor-grabbing",
            "[-webkit-overflow-scrolling:touch]",
            "[scrollbar-width:none] [-ms-overflow-style:none]"
          )}
          // mouse drag handlers
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          // IMPORTANT: allow horizontal panning on touchpads/mobiles
          style={{ touchAction: "pan-x" }}
        >
          {/* hide scrollbar (webkit) */}
          <style>{`
            .tabsScroller::-webkit-scrollbar { display: none; }
          `}</style>

          {items.map((t) => {
            const isActive = active === t.key;
            const Icon = t.Icon;

            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                type="button"
                className={cx(
                  "shrink-0 select-none",
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "border-[#00938F] bg-[#00938F] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                )}
              >
                {Icon ? (
                  <Icon className={cx("h-4 w-4", isActive ? "text-white" : "text-[#00938F]")} />
                ) : null}
                <span className="leading-none">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#F6F8FB] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#F6F8FB] to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col p-6">
          <div className="flex items-start gap-3">
            {current?.Icon ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E9FFFE] text-[#007C79]">
                <current.Icon className="h-5 w-5" />
              </div>
            ) : null}

            <div className="min-w-0">
              <h3 className="text-lg font-extrabold text-slate-900">{current?.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{current?.text}</p>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="text-xs font-bold text-slate-500">
              Tipp: Wähle oben weitere Leistungen aus.
            </div>
          </div>
        </Card>

        <div className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
          <img
            src={current?.imageSrc}
            alt=""
            className="h-full min-h-[280px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
