import React, { useState } from "react";
import { ASSET_BASE } from "./helpers";

export default function VideoBlock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#bfe8ff] shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
        <div className="grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-center text-2xl font-black text-slate-900 lg:text-left">
              Tierkrankenversicherung schnell und einfach erklärt
            </h2>
            <p className="mt-3 text-center text-sm text-slate-700 lg:text-left">
              Das Team von Tierisch Gut versichert
              <br />
              Kostenlose und unverbindliche Beratung
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_12px_24px_rgba(2,6,23,0.15)] transition hover:-translate-y-0.5"
              aria-label="Video abspielen"
            >
              <span className="ml-1 text-2xl text-[#00938F]">▶</span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div className="text-sm font-extrabold text-slate-900">
                Tierkrankenversicherung – Video
              </div>
              <button
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
                type="button"
              >
                Schließen
              </button>
            </div>
            <video
              className="h-auto w-full"
              controls
              preload="metadata"
              poster={`${ASSET_BASE}/images/ss.webp`}
            >
              <source src={`${ASSET_BASE}/video/our-pet-hospital-final-1.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>
      ) : null}
    </>
  );
}
