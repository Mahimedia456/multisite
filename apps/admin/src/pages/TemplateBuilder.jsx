// admin/src/pages/TemplateBuilder.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

/* =========================
   Base helpers
========================= */
function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function getUrl(obj) {
  if (!obj) return "";
  return obj.to ?? obj.href ?? obj.url ?? obj.path ?? "";
}

function setUrl(obj, url) {
  return { ...(obj || {}), href: url, to: url };
}

function normalizeHref(item) {
  if (!item) return "#";
  if (isNonEmptyString(item.href)) return item.href;
  if (isNonEmptyString(item.to)) return item.to;
  if (isNonEmptyString(item.url)) return item.url;
  if (isNonEmptyString(item.path)) return item.path;
  return "#";
}

function move(arr, from, to) {
  const safe = safeArr(arr);
  if (from < 0 || to < 0 || from >= safe.length || to >= safe.length) return safe;

  const next = [...safe];
  const item = next.splice(from, 1)[0];
  next.splice(to, 0, item);
  return next;
}

function getBrandContact(brand = {}) {
  const email =
    brand?.company_email ||
    brand?.companyEmail ||
    brand?.email ||
    brand?.contactEmail ||
    brand?.contact_email ||
    brand?.supportEmail ||
    brand?.support_email ||
    brand?.mail ||
    brand?.company?.email ||
    brand?.contact?.email ||
    brand?.support?.email ||
    "";

  const phone =
    brand?.company_phone ||
    brand?.companyPhone ||
    brand?.phone ||
    brand?.telephone ||
    brand?.tel ||
    brand?.contactPhone ||
    brand?.contact_phone ||
    brand?.supportPhone ||
    brand?.support_phone ||
    brand?.company?.phone ||
    brand?.contact?.phone ||
    brand?.support?.phone ||
    "";

  const whatsapp =
    brand?.company_whatsapp ||
    brand?.companyWhatsapp ||
    brand?.whatsapp ||
    brand?.company?.whatsapp ||
    brand?.contact?.whatsapp ||
    brand?.support?.whatsapp ||
    "";

  const location =
    brand?.company_location ||
    brand?.companyLocation ||
    brand?.location ||
    brand?.address ||
    brand?.city ||
    brand?.company?.location ||
    brand?.company?.address ||
    brand?.contact?.location ||
    brand?.contact?.address ||
    "";

  return { email, phone, whatsapp, location };
}

/* =========================
   Mega helpers
========================= */
function isEmptyColumn(col) {
  const title = String(col?.title || "").trim();
  const items = safeArr(col?.items);
  const footerLabel = String(col?.footerLink?.label || "").trim();
  const hasAnyItem = items.some((it) => String(it?.label || "").trim());

  return !title && !hasAnyItem && !footerLabel;
}

function cleanMega(mega) {
  if (!mega || !Array.isArray(mega.columns)) return null;

  const columns = mega.columns
    .map((c) => ({
      ...c,
      title: c?.title ?? "",
      items: safeArr(c?.items),
      footerLink: c?.footerLink || null,
    }))
    .filter((c) => !isEmptyColumn(c));

  return { ...mega, columns };
}

function hasMega(item) {
  const mega = cleanMega(item?.mega);
  return !!(mega && Array.isArray(mega.columns) && mega.columns.length);
}

/* =========================
   Defaults
========================= */
const DEFAULT_HEADER = {
  name: "",
  logoType: "material",
  logoValue: "pets",
  logoUrl: "",
  homeLinks: [
    { label: "Auto, Haus & Rechts", href: "#", mega: { columns: [] } },
    { label: "Gesundheit & Freizeit", href: "#", mega: { columns: [] } },
    { label: "Tier", href: "#", mega: { columns: [] } },
    { label: "Vorsorge & Vermögen", href: "#", mega: { columns: [] } },
    { label: "Beratung & Kontakt", href: "#", mega: { columns: [] } },
    { label: "Meine Allianz & Services", href: "#", mega: { columns: [] } },
    { label: "Unternehmen", href: "#", mega: { columns: [] } },
    { label: "Über uns", href: "/about" },
  ],
  login: {
    label: "My account",
    href: "https://multisite-admin.vercel.app/login",
  },
  cta: { label: "kontakt", to: "/contact" },
};

const DEFAULT_FOOTER = {
  name: "",
  logoType: "emoji",
  logoValue: "✨",
  logoUrl: "",
  description: "",
  socials: [{ label: "f", href: "#" }],
  columns: [{ title: "Company", links: [{ label: "About Us", href: "/about" }] }],
  bottomLeft: "",
  bottomCenter: "",
  bottomRight: "",
};

/* =========================
   UI components
========================= */
function Badge({ text }) {
  const s = String(text || "").toLowerCase();
  const tone =
    s === "published" || s === "live" || s === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        tone,
      ].join(" ")}
    >
      {text || "draft"}
    </span>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, children }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-[42px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10"
      >
        {children}
      </select>
    </div>
  );
}

function IconButton({ icon, onClick, danger = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "flex h-8 w-8 items-center justify-center rounded-xl transition",
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      <MIcon name={icon} className="text-[18px]" />
    </button>
  );
}

function EmptyState({ icon = "touch_app", title, desc }) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-[26px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
          <MIcon name={icon} className="text-[28px]" />
        </div>
        <div className="mt-4 text-lg font-black text-slate-950">{title}</div>
        <div className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-500">
          {desc}
        </div>
      </div>
    </div>
  );
}

function EditorPanel({ title, desc, action, children }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <div className="text-lg font-black text-slate-950">{title}</div>
          {desc ? <div className="mt-1 text-xs font-semibold text-slate-500">{desc}</div> : null}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* =========================
   Preview components
========================= */
function PreviewLogo({ data }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
      {data.logoType === "image" && data.logoUrl ? (
        <img src={data.logoUrl} alt="logo" className="h-8 w-8 object-contain" />
      ) : data.logoType === "emoji" ? (
        <span className="text-2xl leading-none">{data.logoValue || "✨"}</span>
      ) : (
        <span className="material-symbols-outlined text-2xl leading-none">
          {data.logoValue || "pets"}
        </span>
      )}
    </div>
  );
}

function DesktopHeaderPreview({ brand, data, activeMegaIndex, setActiveMegaIndex }) {
  const contact = getBrandContact(brand);
  const links = safeArr(data.homeLinks);

  const activeItem =
    Number.isInteger(activeMegaIndex) && links[activeMegaIndex] ? links[activeMegaIndex] : null;

  const activeMega = cleanMega(activeItem?.mega);

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="bg-primary text-white">
        <div className="flex h-11 items-center gap-7 overflow-hidden px-6 text-sm font-black">
          {contact.phone ? (
            <div className="flex shrink-0 items-center gap-2">
              <MIcon name="call" className="text-[19px]" />
              <span>{contact.phone}</span>
            </div>
          ) : null}

          {contact.email ? (
            <div className="flex min-w-0 items-center gap-2">
              <MIcon name="mail" className="text-[19px]" />
              <span className="truncate">{contact.email}</span>
            </div>
          ) : null}

          {contact.whatsapp ? (
            <div className="flex shrink-0 items-center gap-2">
              <MIcon name="chat" className="text-[19px]" />
              <span>{contact.whatsapp}</span>
            </div>
          ) : null}

          {contact.location ? (
            <div className="flex shrink-0 items-center gap-2">
              <MIcon name="location_on" className="text-[19px]" />
              <span>{contact.location}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <PreviewLogo data={data} />
          <div className="truncate text-lg font-black text-slate-950">
            {data.name || brand?.name || "Brand"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {data.login?.label ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <MIcon name="person" className="text-[24px]" />
            </div>
          ) : null}

          <div className="flex h-12 items-center rounded-2xl bg-primary px-6 text-sm font-black text-white shadow-lg shadow-primary/20">
            {data.cta?.label || "kontakt"}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white px-5">
        <div className="flex h-[58px] items-center gap-2 overflow-x-auto">
          {links.map((item, idx) => {
            const active = activeMegaIndex === idx;
            const mega = hasMega(item);

            return (
              <button
                key={`${item?.label || "link"}-${idx}`}
                type="button"
                onClick={() => setActiveMegaIndex(mega ? (active ? null : idx) : null)}
                className={[
                  "inline-flex shrink-0 items-center gap-1 rounded-2xl px-3 py-2 text-sm font-bold transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary",
                ].join(" ")}
              >
                {item?.label || "Link"}
                {mega ? <MIcon name="expand_more" className="text-[18px]" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {activeMega && activeMega.columns?.length ? (
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Mega menu
              </div>
              <div className="text-xl font-black text-slate-950">{activeItem?.label || "Menu"}</div>
            </div>

            <button
              type="button"
              onClick={() => setActiveMegaIndex(null)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm hover:text-slate-950"
            >
              <MIcon name="close" className="text-[19px]" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {safeArr(activeMega.columns).map((col, idx) => (
              <div
                key={`${col?.title || "col"}-${idx}`}
                className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="text-sm font-black text-slate-950">{col?.title || ""}</div>

                <div className="mt-3 space-y-2">
                  {safeArr(col?.items).slice(0, 8).map((it, j) => (
                    <div
                      key={`${it?.label || "item"}-${j}`}
                      className="flex items-center gap-2 text-sm font-bold text-slate-600"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {it?.label || "Item"}
                    </div>
                  ))}
                </div>

                {col?.footerLink?.label ? (
                  <div className="mt-4 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-black text-primary">
                    {col.footerLink.label}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="px-6 py-14 text-center">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Live preview
        </div>
        <div className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Global header preview
        </div>
        <div className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
          Click a menu item with mega menu to preview its columns and links.
        </div>
      </div>
    </div>
  );
}

function MobileHeaderPreview({
  brand,
  data,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileSubmenuItem,
  setMobileSubmenuItem,
}) {
  const contact = getBrandContact(brand);
  const links = safeArr(data.homeLinks);

  const contactRows = [
    contact.phone ? { key: "phone", icon: "call", label: contact.phone } : null,
    contact.email ? { key: "email", icon: "mail", label: contact.email } : null,
    contact.whatsapp ? { key: "whatsapp", icon: "chat", label: contact.whatsapp } : null,
    contact.location ? { key: "location", icon: "location_on", label: contact.location } : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <PreviewLogo data={data} />
          <div className="truncate text-lg font-black text-slate-950">
            {data.name || brand?.name || "Brand"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(true);
            setMobileSubmenuItem(null);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
        >
          <MIcon name="menu" className="text-[30px]" />
        </button>
      </div>

      <div className="relative h-[680px] bg-white">
        {!mobileMenuOpen ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Mobile preview
              </div>
              <div className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Tap menu icon
              </div>
              <div className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                Full-page mobile menu will open here, just like the live site header.
              </div>
            </div>
          </div>
        ) : null}

        {mobileMenuOpen ? (
          <div className="absolute inset-0 z-10 flex h-full flex-col bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <PreviewLogo data={data} />
                <div className="truncate text-lg font-black text-slate-950">
                  {data.name || brand?.name || "Brand"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSubmenuItem(null);
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
              >
                <MIcon name="close" className="text-[30px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {contactRows.length ? (
                <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  {contactRows.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                    >
                      <MIcon name={row.icon} className="text-[24px] text-primary" />
                      <div className="min-w-0 flex-1 truncate text-[15px] font-black text-slate-700">
                        {row.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-white">
                  <MIcon name="person" className="text-[21px]" />
                  My account
                </div>

                <div className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-800">
                  <MIcon name="contact_mail" className="text-[21px] text-primary" />
                  kontakt
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {links.map((item, idx) => {
                  const label = item?.label || `Menu ${idx + 1}`;

                  if (hasMega(item)) {
                    return (
                      <button
                        key={`${label}-${idx}`}
                        type="button"
                        onClick={() => setMobileSubmenuItem(item)}
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 text-left last:border-b-0"
                      >
                        <span className="text-[15px] font-black text-slate-900">{label}</span>
                        <MIcon name="chevron_right" className="text-[24px] text-slate-500" />
                      </button>
                    );
                  }

                  return (
                    <div
                      key={`${label}-${idx}`}
                      className="border-b border-slate-100 px-4 py-4 text-[15px] font-black text-slate-900 last:border-b-0"
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {mobileSubmenuItem ? (
          <div className="absolute inset-0 z-20 flex h-full flex-col bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setMobileSubmenuItem(null)}
                className="inline-flex items-center gap-2 text-sm font-black text-slate-700"
              >
                <MIcon name="arrow_back" className="text-[24px]" />
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSubmenuItem(null);
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
              >
                <MIcon name="close" className="text-[30px]" />
              </button>
            </div>

            <div className="border-b border-slate-100 px-5 py-4">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Menu
              </div>
              <div className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                {mobileSubmenuItem.label}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                {safeArr(mobileSubmenuItem?.mega?.columns).map((col, cIdx) => (
                  <div
                    key={`${col?.title || "col"}-${cIdx}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="text-sm font-black uppercase tracking-wide text-slate-500">
                      {col?.title || ""}
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-white">
                      {safeArr(col?.items).map((it, j) => (
                        <div
                          key={`${it?.label || "item"}-${j}`}
                          className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-800 last:border-b-0"
                        >
                          <span>{it?.label || "Link"}</span>
                          <MIcon name="chevron_right" className="text-[18px] text-slate-400" />
                        </div>
                      ))}
                    </div>

                    {col?.footerLink?.label ? (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-black text-primary">
                        {col.footerLink.label}
                        <MIcon name="arrow_forward" className="text-[18px]" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FooterPreview({ brand, data }) {
  const columns = safeArr(data.columns);
  const socials = safeArr(data.socials);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 shadow-xl shadow-slate-300/40">
      <div className="grid grid-cols-1 gap-8 px-8 py-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <PreviewLogo data={data} />
            <div>
              <div className="text-xl font-black text-white">
                {data.name || brand?.name || "Brand"}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Global footer preview
              </div>
            </div>
          </div>

          <div className="mt-5 max-w-sm text-sm font-semibold leading-7 text-slate-400">
            {data.description ||
              "Footer description will appear here. You can edit this from the footer editor."}
          </div>

          {socials.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s, idx) => (
                <div
                  key={`${s?.label || "social"}-${idx}`}
                  className="flex h-10 min-w-10 items-center justify-center rounded-2xl bg-white/10 px-3 text-sm font-black text-white"
                >
                  {s.label || "s"}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {columns.map((c, idx) => (
            <div key={`${c?.title || "section"}-${idx}`}>
              <div className="text-sm font-black uppercase tracking-[0.12em] text-white">
                {c.title || "Section"}
              </div>

              {c.description ? (
                <div className="mt-3 text-sm font-semibold leading-6 text-slate-400">
                  {c.description}
                </div>
              ) : null}

              <div className="mt-4 space-y-2">
                {safeArr(c.links)
                  .slice(0, 7)
                  .map((l, k) => (
                    <div
                      key={`${l?.label || "link"}-${k}`}
                      className="text-sm font-semibold text-slate-400"
                    >
                      {l.label || "Link"}
                    </div>
                  ))}
              </div>

              {c.cta?.label ? (
                <div className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-black text-white">
                  {c.cta.label}
                </div>
              ) : null}

              {c.rating?.value || c.rating?.count ? (
                <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white">
                  ⭐ {c.rating?.value || "5.0"}{" "}
                  <span className="text-slate-400">{c.rating?.count || ""}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-white/10 px-8 py-5 text-sm font-bold text-slate-500 md:grid-cols-3">
        <div>{data.bottomLeft || "© Brand"}</div>
        <div className="text-left md:text-center">{data.bottomCenter || ""}</div>
        <div className="text-left md:text-right">{data.bottomRight || ""}</div>
      </div>
    </div>
  );
}

/* =========================
   Left list components
========================= */
function HeaderMenuList({
  data,
  selectedIndex,
  setSelectedIndex,
  setData,
  setActiveMegaIndex,
  setMobileSubmenuItem,
}) {
  const links = safeArr(data.homeLinks);

  return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="text-sm font-black text-slate-950">Header menus</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">
          Select one menu and edit it in the center panel.
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => {
            setData((d) => ({
              ...d,
              homeLinks: [...safeArr(d.homeLinks), { label: "New Link", href: "#" }],
            }));
            setSelectedIndex(links.length);
          }}
          className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-black text-white shadow-lg shadow-primary/20"
        >
          <MIcon name="add" className="text-[18px]" />
          Add Menu
        </button>

        <div className="space-y-2">
          {links.map((item, idx) => {
            const active = selectedIndex === idx;
            const mega = hasMega(item) || !!item?.mega;

            return (
              <button
                key={`${item?.label || "menu"}-${idx}`}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setActiveMegaIndex(mega ? idx : null);
                  setMobileSubmenuItem(null);
                }}
                className={[
                  "w-full rounded-2xl border p-3 text-left transition",
                  active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Menu #{idx + 1}
                    </div>
                    <div className="mt-1 truncate text-sm font-black text-slate-950">
                      {item?.label || "Untitled"}
                    </div>
                    <div className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                      {mega ? "Mega menu" : normalizeHref(item)}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {mega ? (
                      <span className="rounded-full bg-slate-950 px-2 py-1 text-[9px] font-black uppercase text-white">
                        Mega
                      </span>
                    ) : null}
                    <MIcon name="chevron_right" className="text-[20px] text-slate-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FooterSectionList({ selectedFooterTab, setSelectedFooterTab, data }) {
  const tabs = [
    { key: "brand", label: "Brand", icon: "badge" },
    { key: "socials", label: `Socials (${safeArr(data.socials).length})`, icon: "share" },
    { key: "columns", label: `Columns (${safeArr(data.columns).length})`, icon: "view_column" },
    { key: "bottom", label: "Bottom Bar", icon: "horizontal_rule" },
  ];

  return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="text-sm font-black text-slate-950">Footer sections</div>
        <div className="mt-1 text-xs font-semibold text-slate-500">
          Select a footer section to edit.
        </div>
      </div>

      <div className="space-y-2 p-3">
        {tabs.map((tab) => {
          const active = selectedFooterTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedFooterTab(tab.key)}
              className={[
                "flex w-full items-center justify-between rounded-2xl border p-3 text-left transition",
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white",
              ].join(" ")}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <MIcon name={tab.icon} className="text-[20px]" />
                </span>
                <span className="truncate text-sm font-black text-slate-950">{tab.label}</span>
              </span>
              <MIcon name="chevron_right" className="text-[20px] text-slate-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   Header center editor
========================= */
function HeaderSelectedEditor({
  data,
  setData,
  selectedIndex,
  setSelectedIndex,
  setActiveMegaIndex,
  setMobileSubmenuItem,
}) {
  const links = safeArr(data.homeLinks);
  const item = links[selectedIndex];

  if (!item) {
    return (
      <EmptyState
        title="Select a menu"
        desc="Choose any menu from the left side to edit label, URL, mega columns and submenu links."
      />
    );
  }

  const itemHasMega = !!item?.mega;
  const mega = itemHasMega ? cleanMega(item.mega) || { columns: [] } : null;
  const columns = safeArr(mega?.columns);

  function updateItem(patch) {
    setData((d) => ({
      ...d,
      homeLinks: safeArr(d.homeLinks).map((x, i) => (i === selectedIndex ? { ...x, ...patch } : x)),
    }));
  }

  function replaceItem(nextItem) {
    setData((d) => ({
      ...d,
      homeLinks: safeArr(d.homeLinks).map((x, i) => (i === selectedIndex ? nextItem : x)),
    }));
  }

  function updateMega(nextMega) {
    setData((d) => ({
      ...d,
      homeLinks: safeArr(d.homeLinks).map((x, i) =>
        i === selectedIndex ? { ...x, mega: cleanMega(nextMega) || { columns: [] } } : x
      ),
    }));
  }

  function updateColumn(cIdx, patch) {
    const nextCols = columns.map((c, i) => (i === cIdx ? { ...c, ...patch } : c));
    updateMega({ ...(mega || {}), columns: nextCols });
  }

  function updateColumnItem(cIdx, itemIdx, patch) {
    const nextCols = columns.map((c, i) => {
      if (i !== cIdx) return c;
      return {
        ...c,
        items: safeArr(c.items).map((it, k) => (k === itemIdx ? { ...it, ...patch } : it)),
      };
    });

    updateMega({ ...(mega || {}), columns: nextCols });
  }

  return (
    <div className="space-y-5">
      <EditorPanel
        title={`Menu #${selectedIndex + 1}`}
        desc="Update selected header menu item"
        action={
          <div className="flex items-center gap-1">
            <IconButton
              icon="keyboard_arrow_up"
              title="Move up"
              onClick={() => {
                if (selectedIndex <= 0) return;
                setData((d) => ({ ...d, homeLinks: move(d.homeLinks, selectedIndex, selectedIndex - 1) }));
                setSelectedIndex(selectedIndex - 1);
              }}
            />
            <IconButton
              icon="keyboard_arrow_down"
              title="Move down"
              onClick={() => {
                if (selectedIndex >= links.length - 1) return;
                setData((d) => ({ ...d, homeLinks: move(d.homeLinks, selectedIndex, selectedIndex + 1) }));
                setSelectedIndex(selectedIndex + 1);
              }}
            />
            <IconButton
              icon="delete"
              danger
              title="Delete"
              onClick={() => {
                setData((d) => ({
                  ...d,
                  homeLinks: safeArr(d.homeLinks).filter((_, i) => i !== selectedIndex),
                }));
                setSelectedIndex(Math.max(0, selectedIndex - 1));
              }}
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Label"
            value={item.label || ""}
            onChange={(v) => updateItem({ label: v })}
            placeholder="Menu label"
          />

          <Input
            label="URL (href/to)"
            value={getUrl(item)}
            onChange={(v) => replaceItem(setUrl(item, v))}
            placeholder="# or /about"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <button
            type="button"
            onClick={() => {
              if (itemHasMega) {
                const { mega: _removed, ...rest } = item;
                replaceItem(rest);
                setActiveMegaIndex(null);
                setMobileSubmenuItem(null);
              } else {
                const nextItem = {
                  ...item,
                  mega: {
                    columns: [
                      {
                        title: "Column 1",
                        items: [{ label: "New Item", href: "#" }],
                        footerLink: { label: "Im Überblick", href: "#" },
                      },
                      {
                        title: "Column 2",
                        items: [{ label: "New Item", href: "#" }],
                        footerLink: { label: "Im Überblick", href: "#" },
                      },
                    ],
                  },
                };

                replaceItem(nextItem);
                setActiveMegaIndex(selectedIndex);
                setMobileSubmenuItem(nextItem);
              }
            }}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-black transition",
              itemHasMega
                ? "bg-slate-950 text-white hover:bg-slate-800"
                : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            <MIcon name={itemHasMega ? "toggle_on" : "toggle_off"} className="text-[22px]" />
            {itemHasMega ? "Mega Menu ON" : "Mega Menu OFF"}
          </button>

          <div className="text-xs font-semibold text-slate-500">
            Enable mega menu to add columns and submenu links.
          </div>
        </div>
      </EditorPanel>

      {itemHasMega ? (
        <EditorPanel
          title="Mega menu columns"
          desc="Columns and links for the selected menu"
          action={
            <button
              type="button"
              onClick={() => {
                updateMega({
                  ...(mega || {}),
                  columns: [
                    ...columns,
                    {
                      title: `Column ${columns.length + 1}`,
                      items: [{ label: "New Item", href: "#" }],
                      footerLink: { label: "Im Überblick", href: "#" },
                    },
                  ],
                });
              }}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-white shadow-lg shadow-primary/20"
            >
              <MIcon name="add" className="text-[18px]" />
              Add Column
            </button>
          }
        >
          {columns.length ? (
            <div className="space-y-4">
              {columns.map((col, cIdx) => {
                const items = safeArr(col.items);

                return (
                  <div
                    key={`${col?.title || "col"}-${cIdx}`}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Column #{cIdx + 1}
                        </div>
                        <div className="mt-1 text-sm font-black text-slate-950">
                          {col.title || "Untitled Column"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <IconButton
                          icon="keyboard_arrow_up"
                          onClick={() => {
                            if (cIdx <= 0) return;
                            updateMega({ ...(mega || {}), columns: move(columns, cIdx, cIdx - 1) });
                          }}
                        />
                        <IconButton
                          icon="keyboard_arrow_down"
                          onClick={() => {
                            if (cIdx >= columns.length - 1) return;
                            updateMega({ ...(mega || {}), columns: move(columns, cIdx, cIdx + 1) });
                          }}
                        />
                        <IconButton
                          icon="delete"
                          danger
                          onClick={() => {
                            updateMega({
                              ...(mega || {}),
                              columns: columns.filter((_, i) => i !== cIdx),
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input
                        label="Column title"
                        value={col.title || ""}
                        onChange={(v) => updateColumn(cIdx, { title: v })}
                      />

                      <Input
                        label="Footer label"
                        value={col.footerLink?.label || ""}
                        onChange={(v) =>
                          updateColumn(cIdx, {
                            footerLink: { ...(col.footerLink || {}), label: v },
                          })
                        }
                        placeholder="Im Überblick"
                      />

                      <div className="md:col-span-2">
                        <Input
                          label="Footer URL"
                          value={getUrl(col.footerLink)}
                          onChange={(v) =>
                            updateColumn(cIdx, {
                              footerLink: setUrl(col.footerLink || {}, v),
                            })
                          }
                          placeholder="#"
                        />
                      </div>
                    </div>

                    <div className="mt-4 rounded-[22px] border border-slate-200 bg-white p-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Links
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextCols = columns.map((c, i) =>
                              i === cIdx
                                ? {
                                    ...c,
                                    items: [...safeArr(c.items), { label: "New Item", href: "#" }],
                                  }
                                : c
                            );
                            updateMega({ ...(mega || {}), columns: nextCols });
                          }}
                          className="inline-flex h-9 items-center gap-2 rounded-2xl bg-primary/10 px-3 text-xs font-black text-primary hover:bg-primary/15"
                        >
                          <MIcon name="add" className="text-[16px]" />
                          Add Link
                        </button>
                      </div>

                      <div className="space-y-3">
                        {items.map((it, itemIdx) => (
                          <div
                            key={`${it?.label || "item"}-${itemIdx}`}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                                Element #{itemIdx + 1}
                              </div>

                              <div className="flex items-center gap-1">
                                <IconButton
                                  icon="keyboard_arrow_up"
                                  onClick={() => {
                                    if (itemIdx <= 0) return;
                                    const nextCols = columns.map((c, i) =>
                                      i === cIdx
                                        ? { ...c, items: move(c.items, itemIdx, itemIdx - 1) }
                                        : c
                                    );
                                    updateMega({ ...(mega || {}), columns: nextCols });
                                  }}
                                />
                                <IconButton
                                  icon="keyboard_arrow_down"
                                  onClick={() => {
                                    if (itemIdx >= items.length - 1) return;
                                    const nextCols = columns.map((c, i) =>
                                      i === cIdx
                                        ? { ...c, items: move(c.items, itemIdx, itemIdx + 1) }
                                        : c
                                    );
                                    updateMega({ ...(mega || {}), columns: nextCols });
                                  }}
                                />
                                <IconButton
                                  icon="delete"
                                  danger
                                  onClick={() => {
                                    const nextCols = columns.map((c, i) =>
                                      i === cIdx
                                        ? {
                                            ...c,
                                            items: safeArr(c.items).filter((_, k) => k !== itemIdx),
                                          }
                                        : c
                                    );
                                    updateMega({ ...(mega || {}), columns: nextCols });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <Input
                                label="Label"
                                value={it.label || ""}
                                onChange={(v) => updateColumnItem(cIdx, itemIdx, { label: v })}
                              />

                              <Input
                                label="URL"
                                value={getUrl(it)}
                                onChange={(v) =>
                                  updateColumnItem(cIdx, itemIdx, setUrl(it, v))
                                }
                                placeholder="#"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="view_column"
              title="No columns yet"
              desc="Add a column to build the submenu links for this menu."
            />
          )}
        </EditorPanel>
      ) : null}
    </div>
  );
}

/* =========================
   Footer center editor
========================= */
function FooterSelectedEditor({ data, setData, selectedFooterTab }) {
  if (selectedFooterTab === "brand") {
    return (
      <EditorPanel title="Footer brand" desc="Logo, name and footer description">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Brand name"
            value={data.name || ""}
            onChange={(v) => setData((d) => ({ ...d, name: v }))}
          />

          <SelectInput
            label="Logo type"
            value={data.logoType || "emoji"}
            onChange={(v) => setData((d) => ({ ...d, logoType: v }))}
          >
            <option value="material">material</option>
            <option value="emoji">emoji</option>
            <option value="image">image</option>
          </SelectInput>

          {data.logoType === "image" ? (
            <Input
              label="Logo image URL"
              value={data.logoUrl || ""}
              onChange={(v) => setData((d) => ({ ...d, logoUrl: v }))}
              placeholder="https://..."
            />
          ) : (
            <Input
              label={data.logoType === "emoji" ? "Emoji" : "Material icon"}
              value={data.logoValue || ""}
              onChange={(v) => setData((d) => ({ ...d, logoValue: v }))}
            />
          )}

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={data.description || ""}
              onChange={(v) => setData((d) => ({ ...d, description: v }))}
              rows={4}
            />
          </div>
        </div>
      </EditorPanel>
    );
  }

  if (selectedFooterTab === "socials") {
    return (
      <EditorPanel
        title="Footer socials"
        desc="Social links shown in footer"
        action={
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                socials: [...safeArr(d.socials), { label: "new", href: "#" }],
              }))
            }
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-white shadow-lg shadow-primary/20"
          >
            <MIcon name="add" className="text-[18px]" />
            Add Social
          </button>
        }
      >
        <div className="space-y-3">
          {safeArr(data.socials).map((s, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Social #{idx + 1}
                </div>

                <div className="flex items-center gap-1">
                  <IconButton
                    icon="keyboard_arrow_up"
                    onClick={() => {
                      if (idx <= 0) return;
                      setData((d) => ({ ...d, socials: move(d.socials, idx, idx - 1) }));
                    }}
                  />
                  <IconButton
                    icon="keyboard_arrow_down"
                    onClick={() => {
                      if (idx >= safeArr(data.socials).length - 1) return;
                      setData((d) => ({ ...d, socials: move(d.socials, idx, idx + 1) }));
                    }}
                  />
                  <IconButton
                    icon="delete"
                    danger
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        socials: safeArr(d.socials).filter((_, i) => i !== idx),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="Label"
                  value={s.label || ""}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      socials: safeArr(d.socials).map((x, i) =>
                        i === idx ? { ...x, label: v } : x
                      ),
                    }))
                  }
                />

                <Input
                  label="URL"
                  value={s.href || ""}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      socials: safeArr(d.socials).map((x, i) =>
                        i === idx ? { ...x, href: v } : x
                      ),
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </EditorPanel>
    );
  }

  if (selectedFooterTab === "columns") {
    const columns = safeArr(data.columns);

    return (
      <EditorPanel
        title="Footer columns"
        desc="Footer sections, links, CTA and ratings"
        action={
          <button
            type="button"
            onClick={() =>
              setData((d) => ({
                ...d,
                columns: [
                  ...safeArr(d.columns),
                  { title: "NEW SECTION", links: [{ label: "New Link", href: "#" }] },
                ],
              }))
            }
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-white shadow-lg shadow-primary/20"
          >
            <MIcon name="add" className="text-[18px]" />
            Add Column
          </button>
        }
      >
        <div className="space-y-4">
          {columns.map((col, cIdx) => {
            const links = safeArr(col.links);

            return (
              <div key={cIdx} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Footer Column #{cIdx + 1}
                    </div>
                    <div className="mt-1 text-sm font-black text-slate-950">
                      {col.title || "Untitled"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <IconButton
                      icon="keyboard_arrow_up"
                      onClick={() => {
                        if (cIdx <= 0) return;
                        setData((d) => ({ ...d, columns: move(d.columns, cIdx, cIdx - 1) }));
                      }}
                    />
                    <IconButton
                      icon="keyboard_arrow_down"
                      onClick={() => {
                        if (cIdx >= columns.length - 1) return;
                        setData((d) => ({ ...d, columns: move(d.columns, cIdx, cIdx + 1) }));
                      }}
                    />
                    <IconButton
                      icon="delete"
                      danger
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          columns: safeArr(d.columns).filter((_, i) => i !== cIdx),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    label="Title"
                    value={col.title || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx ? { ...x, title: v } : x
                        ),
                      }))
                    }
                  />

                  <Input
                    label="Type"
                    value={col.type || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx ? { ...x, type: v } : x
                        ),
                      }))
                    }
                    placeholder="career / rating / etc"
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Description"
                      value={col.description || ""}
                      onChange={(v) =>
                        setData((d) => ({
                          ...d,
                          columns: safeArr(d.columns).map((x, i) =>
                            i === cIdx ? { ...x, description: v } : x
                          ),
                        }))
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Links
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          columns: safeArr(d.columns).map((x, i) =>
                            i === cIdx
                              ? {
                                  ...x,
                                  links: [...safeArr(x.links), { label: "New Link", href: "#" }],
                                }
                              : x
                          ),
                        }))
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-2xl bg-primary/10 px-3 text-xs font-black text-primary hover:bg-primary/15"
                    >
                      <MIcon name="add" className="text-[16px]" />
                      Add Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {links.map((lnk, lIdx) => (
                      <div key={lIdx} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Link #{lIdx + 1}
                          </div>

                          <div className="flex items-center gap-1">
                            <IconButton
                              icon="keyboard_arrow_up"
                              onClick={() => {
                                if (lIdx <= 0) return;
                                setData((d) => ({
                                  ...d,
                                  columns: safeArr(d.columns).map((x, i) =>
                                    i === cIdx
                                      ? { ...x, links: move(x.links, lIdx, lIdx - 1) }
                                      : x
                                  ),
                                }));
                              }}
                            />
                            <IconButton
                              icon="keyboard_arrow_down"
                              onClick={() => {
                                if (lIdx >= links.length - 1) return;
                                setData((d) => ({
                                  ...d,
                                  columns: safeArr(d.columns).map((x, i) =>
                                    i === cIdx
                                      ? { ...x, links: move(x.links, lIdx, lIdx + 1) }
                                      : x
                                  ),
                                }));
                              }}
                            />
                            <IconButton
                              icon="delete"
                              danger
                              onClick={() =>
                                setData((d) => ({
                                  ...d,
                                  columns: safeArr(d.columns).map((x, i) =>
                                    i === cIdx
                                      ? {
                                          ...x,
                                          links: safeArr(x.links).filter((_, k) => k !== lIdx),
                                        }
                                      : x
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Input
                            label="Label"
                            value={lnk.label || ""}
                            onChange={(v) =>
                              setData((d) => ({
                                ...d,
                                columns: safeArr(d.columns).map((x, i) =>
                                  i === cIdx
                                    ? {
                                        ...x,
                                        links: safeArr(x.links).map((z, k) =>
                                          k === lIdx ? { ...z, label: v } : z
                                        ),
                                      }
                                    : x
                                ),
                              }))
                            }
                          />

                          <Input
                            label="URL"
                            value={lnk.href || ""}
                            onChange={(v) =>
                              setData((d) => ({
                                ...d,
                                columns: safeArr(d.columns).map((x, i) =>
                                  i === cIdx
                                    ? {
                                        ...x,
                                        links: safeArr(x.links).map((z, k) =>
                                          k === lIdx ? { ...z, href: v } : z
                                        ),
                                      }
                                    : x
                                ),
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    label="CTA label"
                    value={col.cta?.label || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx ? { ...x, cta: { ...(x.cta || {}), label: v } } : x
                        ),
                      }))
                    }
                  />

                  <Input
                    label="CTA URL"
                    value={col.cta?.href || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx ? { ...x, cta: { ...(x.cta || {}), href: v } } : x
                        ),
                      }))
                    }
                  />

                  <Input
                    label="Rating value"
                    value={col.rating?.value || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx
                            ? { ...x, rating: { ...(x.rating || {}), value: v } }
                            : x
                        ),
                      }))
                    }
                  />

                  <Input
                    label="Rating count"
                    value={col.rating?.count || ""}
                    onChange={(v) =>
                      setData((d) => ({
                        ...d,
                        columns: safeArr(d.columns).map((x, i) =>
                          i === cIdx
                            ? { ...x, rating: { ...(x.rating || {}), count: v } }
                            : x
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </EditorPanel>
    );
  }

  return (
    <EditorPanel title="Footer bottom bar" desc="Footer bottom left, center and right text">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Bottom left"
          value={data.bottomLeft || ""}
          onChange={(v) => setData((d) => ({ ...d, bottomLeft: v }))}
        />

        <Input
          label="Bottom center"
          value={data.bottomCenter || ""}
          onChange={(v) => setData((d) => ({ ...d, bottomCenter: v }))}
        />

        <Input
          label="Bottom right"
          value={data.bottomRight || ""}
          onChange={(v) => setData((d) => ({ ...d, bottomRight: v }))}
        />
      </div>
    </EditorPanel>
  );
}

/* =========================
   Main component
========================= */
export default function TemplateBuilder() {
  const { brandId, templateId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isHeader = templateId === "header";
  const isFooter = templateId === "footer";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [brand, setBrand] = useState(null);
  const [templateMeta, setTemplateMeta] = useState(null);
  const [data, setData] = useState(isHeader ? DEFAULT_HEADER : DEFAULT_FOOTER);

  const [saving, setSaving] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFooterTab, setSelectedFooterTab] = useState("brand");

  const [previewMode, setPreviewMode] = useState("desktop");
  const [activeMegaIndex, setActiveMegaIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const [mobileSubmenuItem, setMobileSubmenuItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        if (!isHeader && !isFooter) {
          setErr("Only header/footer templates are supported.");
          return;
        }

        const res = await apiFetch(`/admin/brands/${brandId}/detail`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to load template.");
        }

        const b = json.data.brand;
        const template = safeArr(json.data.templates).find((x) => x.key === templateId);
        const content = template?.latestVersion?.content;

        if (cancelled) return;

        setBrand(b);
        setTemplateMeta(template || null);

        if (content && typeof content === "object") {
          if (isHeader) {
            const merged = { ...DEFAULT_HEADER, ...content };

            merged.login = merged.login
              ? setUrl(merged.login, getUrl(merged.login))
              : DEFAULT_HEADER.login;

            merged.cta = merged.cta ? setUrl(merged.cta, getUrl(merged.cta)) : DEFAULT_HEADER.cta;

            merged.homeLinks = safeArr(merged.homeLinks).map((l) => ({
              ...l,
              ...setUrl(l, getUrl(l)),
              mega: l?.mega ? cleanMega(l.mega) || { columns: [] } : undefined,
            }));

            setData(merged);
            setSelectedIndex(0);

            const firstMegaIndex = merged.homeLinks.findIndex((x) => hasMega(x));
            setActiveMegaIndex(firstMegaIndex >= 0 ? firstMegaIndex : null);
          }

          if (isFooter) {
            setData({ ...DEFAULT_FOOTER, ...content });
          }
        } else {
          const base = isHeader ? DEFAULT_HEADER : DEFAULT_FOOTER;
          setData({ ...base, name: b?.name || "" });
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load template.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (brandId && templateId) load();

    return () => {
      cancelled = true;
    };
  }, [brandId, templateId, isHeader, isFooter]);

  const title = useMemo(() => {
    if (isHeader) return t("templateBuilderGlobalHeader") || "Global Header";
    if (isFooter) return t("templateBuilderGlobalFooter") || "Global Footer";
    return templateId;
  }, [templateId, isHeader, isFooter, t]);

  const status = templateMeta?.status || "draft";
  const saveDisabled = saving || !templateMeta?.id;

  async function refreshTemplateMeta() {
    const r2 = await apiFetch(`/admin/brands/${brandId}/detail`);
    const j2 = await r2.json().catch(() => null);

    if (!r2.ok || !j2?.ok) return;

    const t2 = safeArr(j2?.data?.templates).find((x) => x.key === templateId);
    if (t2) setTemplateMeta(t2);
  }

  async function saveAsNewVersion(nextStatus) {
    if (!templateMeta?.id) {
      alert("Template ID missing.");
      return;
    }

    setSaving(true);

    try {
      const res = await apiFetch(`/admin/layout-templates/${templateMeta.id}/versions`, {
        method: "POST",
        body: {
          content: data,
          status: nextStatus || undefined,
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to save template.");
      }

      await refreshTemplateMeta();
      alert(nextStatus ? "Saved and published." : "Saved.");
    } catch (e) {
      alert(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-7xl py-10 text-slate-500">Loading...</div>;
  }

  if (err) {
    return (
      <div className="mx-auto max-w-7xl py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-700">
          {err}
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate(`/brands/${brandId}`)}
            className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="fixed inset-0 z-[999] bg-slate-50">
    {/* Top Builder Bar */}
    <div className="h-[74px] border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/brands/${brandId}`)}
            className="flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white hover:bg-slate-800"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <span>Brands</span>
              <span>›</span>
              <span className="truncate">{brand?.name || brandId}</span>
              <span>›</span>
              <span>Templates</span>
            </div>

            <div className="mt-1 flex min-w-0 items-center gap-3">
              <h1 className="truncate text-xl font-black tracking-tight text-slate-950">
                {title}
              </h1>

              <Badge text={status} />

              {templateMeta?.id ? (
                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 xl:inline-flex">
                  template_id: <span className="ml-1 font-mono">{templateMeta.id}</span>
                </span>
              ) : (
                <span className="text-xs font-black text-red-600">
                  Template ID missing
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isHeader ? (
            <div className="mr-1 flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              {[
                { key: "desktop", icon: "desktop_windows" },
                { key: "mobile", icon: "smartphone" },
              ].map((x) => (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => {
                    setPreviewMode(x.key);
                    if (x.key === "mobile") {
                      setMobileMenuOpen(true);
                      setMobileSubmenuItem(null);
                    }
                  }}
                  className={[
                    "flex h-9 w-10 items-center justify-center rounded-xl transition",
                    previewMode === x.key
                      ? "bg-white text-primary shadow-sm"
                      : "text-slate-400 hover:text-slate-700",
                  ].join(" ")}
                  title={x.key}
                >
                  <MIcon name={x.icon} className="text-[18px]" />
                </button>
              ))}
            </div>
          ) : null}

          <button
            disabled={saveDisabled}
            onClick={() => saveAsNewVersion(undefined)}
            className={[
              "h-11 rounded-2xl px-5 text-sm font-black text-white",
              saveDisabled ? "bg-slate-400" : "bg-slate-950 hover:bg-slate-800",
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
            disabled={saveDisabled}
            onClick={() => saveAsNewVersion("published")}
            className={[
              "h-11 rounded-2xl px-5 text-sm font-black text-white shadow-lg shadow-primary/20",
              saveDisabled ? "bg-primary/40" : "bg-primary hover:bg-primary/90",
            ].join(" ")}
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>

    {/* Full Page Builder Body */}
    <div className="grid h-[calc(100vh-74px)] min-h-0 grid-cols-[310px_minmax(0,1fr)_470px] overflow-hidden">
      {/* Left: Menu / Section List */}
    <aside className="min-h-0 overflow-hidden border-r border-slate-200 bg-white">
  <div className="h-full min-h-0 overflow-y-auto p-4">
          {isHeader ? (
            <HeaderMenuList
              data={data}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              setData={setData}
              setActiveMegaIndex={setActiveMegaIndex}
              setMobileSubmenuItem={setMobileSubmenuItem}
            />
          ) : (
            <FooterSectionList
              selectedFooterTab={selectedFooterTab}
              setSelectedFooterTab={setSelectedFooterTab}
              data={data}
            />
          )}
        </div>
      </aside>

      {/* Center: Preview */}
      <main className="min-h-0 min-w-0 overflow-y-auto bg-slate-100">
        <div className="mx-auto flex min-h-full w-full max-w-none flex-col p-4">
          <div className="mb-4 flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <div className="text-sm font-black text-slate-950">Preview</div>
              <div className="text-xs font-semibold text-slate-500">
                {isHeader && previewMode === "mobile"
                  ? "Mobile full-page menu preview"
                  : "Live visual preview"}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-500">
              <MIcon name="visibility" className="text-[16px]" />
              {isHeader ? previewMode : "footer"}
            </div>
          </div>

          <div className="flex flex-1 items-start justify-center rounded-[30px] border border-slate-200 bg-white p-3 shadow-inner">
            <div className="w-full">
              {isHeader && previewMode === "desktop" ? (
                <DesktopHeaderPreview
                  brand={brand}
                  data={data}
                  activeMegaIndex={activeMegaIndex}
                  setActiveMegaIndex={setActiveMegaIndex}
                />
              ) : null}

              {isHeader && previewMode === "mobile" ? (
                <MobileHeaderPreview
                  brand={brand}
                  data={data}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                  mobileSubmenuItem={mobileSubmenuItem}
                  setMobileSubmenuItem={setMobileSubmenuItem}
                />
              ) : null}

              {isFooter ? <FooterPreview brand={brand} data={data} /> : null}
            </div>
          </div>
        </div>
      </main>

      {/* Right: Update Panel */}
    <aside className="min-h-0 overflow-hidden border-l border-slate-200 bg-white">
  <div className="h-full min-h-0 overflow-y-auto p-4">
          {isHeader ? (
            <HeaderSelectedEditor
              data={data}
              setData={setData}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              setActiveMegaIndex={setActiveMegaIndex}
              setMobileSubmenuItem={setMobileSubmenuItem}
            />
          ) : (
            <FooterSelectedEditor
              data={data}
              setData={setData}
              selectedFooterTab={selectedFooterTab}
            />
          )}
        </div>
      </aside>
    </div>
  </div>
);
}