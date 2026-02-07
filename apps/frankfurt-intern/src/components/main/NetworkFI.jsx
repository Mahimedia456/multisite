import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";

/* ---------- PRESET COORDS (INSTANT) ----------
   These are approximate city-center coordinates.
   Add more cities here anytime (instant improvement).
--------------------------------------------- */
const CITY_PRESET = {
  "Aachen": { lat: 50.7753, lng: 6.0839 },
  "Ampfing": { lat: 48.2559, lng: 12.4160 },
  "Bad Baden": { lat: 48.7606, lng: 8.2398 }, // (typo in data sometimes)
  "Baden Baden": { lat: 48.7606, lng: 8.2398 },
  "Bad Honnef": { lat: 50.6455, lng: 7.2308 },
  "Bad Homburg": { lat: 50.2267, lng: 8.6160 },
  "Bad Krozingen": { lat: 47.9168, lng: 7.7018 },
  "Bad Schussenried": { lat: 48.0040, lng: 9.6592 },
  "Bad Vilbel": { lat: 50.1833, lng: 8.7333 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Biberach": { lat: 48.0984, lng: 9.7900 },
  "Bielefeld": { lat: 52.0302, lng: 8.5325 },
  "Bremerhaven": { lat: 53.5396, lng: 8.5809 },
  "Coburg": { lat: 50.2590, lng: 10.9640 },
  "Detmold": { lat: 51.9385, lng: 8.8732 },
  "Dudenhofen": { lat: 49.3181, lng: 8.3886 },
  "Duisburg": { lat: 51.4344, lng: 6.7623 },
  "Emsdetten": { lat: 52.1731, lng: 7.5286 },
  "Enkenbach-Alsenborn": { lat: 49.4906, lng: 7.9016 },
  "Essen": { lat: 51.4556, lng: 7.0116 },
  "Frankfurt am Main": { lat: 50.1109, lng: 8.6821 },
  "Frechen-Königsdorf": { lat: 50.9137, lng: 6.8107 },
  "Freiburg": { lat: 47.9990, lng: 7.8421 },
  "Friedberg": { lat: 50.3358, lng: 8.7555 },
  "Garmisch-Partenkirchen": { lat: 47.4917, lng: 11.0955 },
  "Gießen": { lat: 50.5841, lng: 8.6784 },
  "Grebenhain": { lat: 50.4860, lng: 9.3380 },
  "Grünstadt": { lat: 49.5641, lng: 8.1622 },
  "Gummersbach": { lat: 51.0263, lng: 7.5647 },
  "Halle": { lat: 51.4825, lng: 11.9705 },
  "Hamburg": { lat: 53.5511, lng: 9.9937 },
  "Hameln": { lat: 52.1046, lng: 9.3560 },
  "Hanau": { lat: 50.1347, lng: 8.9160 },
  "Hattersheim": { lat: 50.0693, lng: 8.4865 },
  "Herborn": { lat: 50.6818, lng: 8.2996 },
  "Karben": { lat: 50.2333, lng: 8.7667 },
  "Köln": { lat: 50.9375, lng: 6.9603 },
  "Kulmbach": { lat: 50.1033, lng: 11.4503 },
  "Limburg": { lat: 50.3833, lng: 8.0500 },
  "Lübeck": { lat: 53.8655, lng: 10.6866 },
  "Maintal": { lat: 50.1500, lng: 8.8333 },
  "Mannheim": { lat: 49.4875, lng: 8.4660 },
  "Markdorf": { lat: 47.7198, lng: 9.3900 },
  "Monschau": { lat: 50.5550, lng: 6.2422 },
  "Monsheim": { lat: 49.6344, lng: 8.2115 },
  "Mönchengladbach": { lat: 51.1805, lng: 6.4428 },
  "Mülheim-Ruhr": { lat: 51.4332, lng: 6.8797 },
  "Mülheim-Kärlich": { lat: 50.3859, lng: 7.5051 },
  "München": { lat: 48.1351, lng: 11.5820 },
  "Münster": { lat: 51.9607, lng: 7.6261 },
  "Oberhausen": { lat: 51.4963, lng: 6.8638 },
  "Offenbach": { lat: 50.0956, lng: 8.7761 },
  "Ochtrup": { lat: 52.2103, lng: 7.1876 },
  "Osnabrück": { lat: 52.2799, lng: 8.0472 },
  "Pirmasens": { lat: 49.2017, lng: 7.6057 },
  "Rellingen": { lat: 53.6510, lng: 9.8317 },
  "Scheeßel": { lat: 53.1650, lng: 9.4830 },
  "Schöneck": { lat: 50.2015, lng: 8.8336 }, // Schöneck (Hessen)
  "Steinen": { lat: 47.6448, lng: 7.7397 },
  "Viernheim": { lat: 49.5400, lng: 8.5780 },
  "Weissenburg": { lat: 49.0300, lng: 10.9700 }, // Weißenburg i. Bay.
  "Willich": { lat: 51.2650, lng: 6.5480 },
  "Wittingen": { lat: 52.7260, lng: 10.7380 }
};

function normalizeCity(c) {
  const v = (c || "").trim();
  if (!v) return "";
  return v
    .replace("Frankfurt / Main", "Frankfurt am Main")
    .replace("Frankfurt a. M.", "Frankfurt am Main")
    .replace(/^Frankfurt$/, "Frankfurt am Main");
}

/* ---------- PIN ICON ---------- */
const pinSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z" fill="#f97316"/>
    <circle cx="12" cy="10" r="3.2" fill="#111827"/>
  </svg>
`);

const pinIcon = new L.DivIcon({
  className: "fi-pin",
  html: `
    <div class="fi-pin-pulse">
      <img src="data:image/svg+xml,${pinSvg}" style="width:30px;height:30px;display:block;" />
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
  popupAnchor: [0, -24],
});

/* ---------- CLUSTER ICON ---------- */
function clusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 44 : count < 50 ? 52 : 60;
  return new L.DivIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:9999px;
        background: rgba(249,115,22,.95);
        box-shadow: 0 20px 60px rgba(0,0,0,.6);
        display:grid;place-items:center;
        border: 1px solid rgba(0,0,0,.35);
      ">
        <div style="
          width:${size - 14}px;height:${size - 14}px;border-radius:9999px;
          background: rgba(17,24,39,.92);
          display:grid;place-items:center;
          border: 1px solid rgba(255,255,255,.08);
          color:white;font-weight:900;
          font-size:${count < 10 ? 13 : 12}px;
          letter-spacing:.12em;
        ">${count}</div>
      </div>
    `,
    className: "fi-cluster",
    iconSize: L.point(size, size),
  });
}

/* ---------- DATA ---------- */
const membersRaw = [
  { label: "Allianz 1", city: "Frankfurt", url: "https://www.allianz.de/" },
  { label: "Allianz 2", city: "Berlin", url: "https://www.allianz.de/" },

  { label: "Mitglieder von Frankfurt Intern e.V.", city: "", url: null },
  { label: "Achim Stollenwerk", city: "Aachen", url: null },
  { label: "Agentur Stemmer Generalvertretung", city: "Detmold", url: null },
  { label: "Allianz Bakemeier Versicherungsteam", city: "Münster", url: null },
  { label: "Allianz Generalvertretung Andreas W.W. Haase", city: "Coburg", url: null },
  { label: "Allianz Generalvertretung Grünwald & Weiler OHG", city: "Grünstadt", url: null },
  { label: "Allianz Hauptvertretung Aziz Sayik", city: "Duisburg", url: null },
  { label: "Allianz Versicherung Adolph u. Team SAG Agentur", city: "Mannheim", url: null },
  { label: "Allianz Versicherung NMS Blank OHG", city: "Bremerhaven", url: null },
  { label: "Allianz Versicherung Schoder & Altuntas OHG", city: "Baden Baden", url: null },
  { label: "Allianz Vertretung KOSH OHG", city: "Willich", url: null },
  { label: "Anders und Noy OHG", city: "Berlin", url: null },
  { label: "Andreas Rosenberg Generalvertretung", city: "Bremerhaven", url: null },
  { label: "Andreas Stühmeier e.K Generalvertretung", city: "Bielefeld", url: null },
  { label: "Brüggemeiner & Schütt OHG", city: "Köln", url: null },
  { label: "Cem Ulgur Generalvertretung", city: "Osnabrück", url: null },
  { label: "Cemal Kurt Generalvertretung", city: "Hattersheim", url: null },
  { label: "Chris Kiefer Generalvertretung", city: "Steinen", url: null },
  { label: "Christian Schnubel Generalvertretung", city: "Dudenhofen", url: null },
  { label: "Christian Sellin Generalvertretung", city: "Lübeck", url: null },
  { label: "Christoph Bahnmüller eK Generalvertretung", city: "Wittingen", url: null },
  { label: "Christopher Senk Hauptvertretung", city: "Bad Honnef", url: null },
  { label: "Cramer & Herling OHG Allianz Generalvertretung", city: "Gummersbach", url: null },
  { label: "Dierk Eisenberg Generalvertretung", city: "Schöneck", url: null },
  { label: "Dirk Jakob Generalvertretung", city: "München", url: null },
  { label: "Dirk Olivier Generalvertretung", city: "Monschau", url: null },
  { label: "Domenique Döpke Generalvertretung", city: "Monsheim", url: null },
  { label: "Dr. Theobald und Co. KG Generalvertretung", city: "Offenbach", url: null },
  { label: "Finanzkontor Riccius und Kul OHG Generalvertretung", city: "Rellingen", url: null },
  { label: "Fink OHG Generalvertretung", city: "Essen", url: null },
  { label: "Florian Schwing Generalvertretung", city: "Hanau", url: null },
  { label: "Frank Windelband e.K. Generalvertretung", city: "Maintal", url: null },
  { label: "Gunter Frenzel e.K. Inh. Denis Frenzel Generalvertretung", city: "Bad Homburg", url: null },
  { label: "Harald Koob Generalvertretung", city: "Frankfurt", url: null },
  { label: "Heiko Mögebier Generalvertretung", city: "Hameln", url: null },
  { label: "Hermann Hewing Genreralvertretung", city: "Ochtrup", url: null },
  { label: "Jansen und Jansen OHG Generalvertretung", city: "Mönchengladbach", url: null },
  { label: "Jens Nasgowitz Generalvertretung", city: "Frankfurt / Main", url: null },
  { label: "Jäger Löhle Göbel OHG Allianz Generalvertretung", city: "Markdorf", url: null },
  { label: "Kevin Heitz Generalvertretung", city: "Bad Krozingen", url: null },
  { label: "Klaus Jochen Henn Generalvertretung", city: "Pirmasens", url: null },
  { label: "Kranefeld u. Kranefeld OHG Generalvertretung", city: "Frechen-Königsdorf", url: null },
  { label: "Krauss Vers.-Verm. KG", city: "Mülheim-Ruhr", url: null },
  { label: "Kreideweiss GbR", city: "Halle", url: null },
  { label: "Kremer und Buchele OHG Generalvertretung", city: "Karben", url: null },
  { label: "Lidija Jovanova Generalvertretung", city: "Hamburg", url: null },
  { label: "Manuel Vollbrecht Generalvertretung", city: "Limburg", url: null },
  { label: "Manuel Wolfrath Generalvertretung", city: "Enkenbach-Alsenborn", url: null },
  { label: "Martin Wesener Generalvertretung", city: "Bad Vilbel", url: null },
  { label: "Metz, Mandler, Kratz, Brand GbR Generalvertretung", city: "Herborn", url: null },
  { label: "Michael Serth Generalvertretung", city: "Gießen", url: null },
  { label: "Oktay Isik Generalvertretung", city: "Mannheim", url: null },
  { label: "Oliver Klüh", city: "Grebenhain", url: null },
  { label: "Philipp Königer Generalvertretung", city: "Freiburg", url: null },
  { label: "Prentas und Prentas OHG Generalvertretung", city: "Kulmbach", url: null },
  { label: "Ralf Drude Generalvertretung", city: "Frankfurt", url: null },
  { label: "Rene Capitain Generalvertretung", city: "Mülheim-Kärlich", url: null },
  { label: "Romeo Berente KG Allianz Generalvertretung", city: "Frankfurt", url: null },
  { label: "Ronnie Kuhlmann Generalvertretung", city: "Friedberg", url: null }, // not preset; add if needed
  { label: "Roskos und Meier Generalvertretung OHG", city: "Berlin", url: null },
  { label: "Rouven Stieghahn Generalvertretung", city: "Scheeßel", url: null },
  { label: "Samed Topuzovic Generalvertretung", city: "Hamburg", url: null },
  { label: "Sandkühler OHG Generalvertretung", city: "Oberhausen", url: null }, // not preset; add if needed
  { label: "Schlossmacher & Vogt OHG", city: "Frankfurt", url: null },
  { label: "Senftl OHG Generalvertretung der Allianz", city: "Ampfing", url: null },
  { label: "Solz und Zimmermann Inh. K. Müller u. J. Ruppel", city: "Frankfurt a. M.", url: null },
  { label: "Stephan Hungerland e.K. Hauptvertretung", city: "Köln", url: null },
  { label: "Thilo Maurer Generalvertretung", city: "Weissenburg", url: null },
  { label: "Thomas Fessler Generalvertretung", city: "Bad Schussenried", url: null }, // not preset; add if needed
  { label: "Thomas H. Fülbier Generalvertretung", city: "Viernheim", url: null },
  { label: "Tim Oberbeckmann Allianz Generalvertretung", city: "Essen", url: null },
  { label: "Ungeheuer Dr. Theobald Dr. Casmir OHG", city: "Frankfurt / Main", url: null },
  { label: "Versicherungs-Finanzhaus Ballwanz I Allianz", city: "Berlin", url: null },
  { label: "Versicherungshaus Hiller Inh. Wolfgang Hiller GV Adolf Hiller Generalvertretung", city: "Biberach", url: null },
  { label: "Voigt OHG Generalvertretung", city: "Essen", url: null },
  { label: "Witte GbR Inh. Witte und Neumann Generalvertretung", city: "Emsdetten", url: null },
  { label: "Wolfram Blank eK Generalvertretung", city: "Garmisch-Partenkirchen", url: null },
  { label: "Özgün Yücel Generalvertretung", city: "Köln", url: null },
];

/* ---------- MODAL ---------- */
function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-zinc-950 ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- GEO (FALLBACK ONLY) ---------- */
const GEO_CACHE_KEY = "fi_coordsByCity_v2";

async function geocodeCity(city, signal) {
  const q = encodeURIComponent(`${city}, Germany`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  const data = await res.json();
  if (!data?.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

function regionFromLatLng(lat, lng) {
  if (lat >= 53) return "Nord";
  if (lat <= 49) return "Süd";
  if (lng >= 11.5) return "Ost";
  if (lng <= 7.5) return "West";
  return "Mitte";
}

/* ---------- MAP HELPERS ---------- */
function InvalidateSize({ when }) {
  const map = useMap();
  useEffect(() => {
    if (!when) return;
    const t = setTimeout(() => map.invalidateSize(true), 120);
    return () => clearTimeout(t);
  }, [when, map]);
  return null;
}

function FitToMarkers({ markers, padding = [60, 60] }) {
  const map = useMap();
  useEffect(() => {
    if (!markers?.length) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding });
  }, [markers, map, padding]);
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], 8, { duration: 0.8 });
  }, [target, map]);
  return null;
}

/* ---------- CLUSTER LAYER ---------- */
function ClusterLayer({ markers, onCitySelect }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 70,
      iconCreateFunction: clusterIcon,
    });

    (markers || []).forEach((m) => {
      const marker = L.marker([m.lat, m.lng], { icon: pinIcon });

      marker.bindTooltip(
        `
          <div style="min-width:240px">
            <div style="font-weight:900;font-size:14px">${m.city}</div>
            <div style="opacity:.78;font-size:12px;margin-top:4px">${m.count} Mitglieder • ${m.region}</div>
          </div>
        `,
        { sticky: true, direction: "top", opacity: 1, className: "fi-tooltip" }
      );

      marker.on("click", () => onCitySelect?.(m));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
      cluster.clearLayers();
    };
  }, [map, markers, onCitySelect]);

  return null;
}

/* ---------- MAIN ---------- */
export default function NetworkFI() {
  const members = useMemo(() => {
    return membersRaw
      .filter((m) => m.label && m.label !== "Mitglieder von Frankfurt Intern e.V.")
      .map((m) => ({ ...m, city: normalizeCity(m.city) }))
      .filter((m) => m.city);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  // filters
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("Alle");
  const [regionFilter, setRegionFilter] = useState("Alle");
  const [selectedCity, setSelectedCity] = useState(null);

  // ✅ coords start with preset + localStorage (instant)
  const [coordsByCity, setCoordsByCity] = useState(() => {
    let fromStorage = {};
    try {
      const raw = localStorage.getItem(GEO_CACHE_KEY);
      fromStorage = raw ? JSON.parse(raw) : {};
    } catch {}
    return { ...CITY_PRESET, ...fromStorage };
  });

  const loadingRef = useRef(false);

  const uniqueCities = useMemo(() => Array.from(new Set(members.map((m) => m.city))).filter(Boolean), [members]);

  const missingCities = useMemo(() => uniqueCities.filter((c) => !coordsByCity[c]), [uniqueCities, coordsByCity]);

  // ✅ fallback geocode only if really missing (usually 0)
  const geocodeMissingFallback = useCallback(async () => {
    if (loadingRef.current) return;
    if (!missingCities.length) return;

    loadingRef.current = true;
    const next = { ...coordsByCity };

    // do only a few, sequential (avoid rate limit)
    for (const city of missingCities.slice(0, 10)) {
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 8000);
        const pt = await geocodeCity(city, controller.signal);
        clearTimeout(t);
        if (pt) next[city] = pt;
      } catch {}
    }

    setCoordsByCity(next);
    try {
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(next));
    } catch {}

    loadingRef.current = false;
  }, [missingCities, coordsByCity]);

  useEffect(() => {
    geocodeMissingFallback();
  }, [geocodeMissingFallback]);

  // markers by city
  const allCityMarkers = useMemo(() => {
    const byCity = new Map();

    for (const m of members) {
      const pt = coordsByCity[m.city];
      if (!pt) continue;
      const arr = byCity.get(m.city) || [];
      arr.push(m);
      byCity.set(m.city, arr);
    }

    return Array.from(byCity.entries()).map(([city, list]) => {
      const { lat, lng } = coordsByCity[city];
      const region = regionFromLatLng(lat, lng);
      return { city, lat, lng, region, members: list, count: list.length };
    });
  }, [members, coordsByCity]);

  const regions = useMemo(() => {
    const set = new Set(allCityMarkers.map((m) => m.region));
    return ["Alle"].concat(Array.from(set).sort((a, b) => a.localeCompare(b)));
  }, [allCityMarkers]);

  const cities = useMemo(() => {
    const set = new Set(members.map((m) => m.city));
    return ["Alle"].concat(Array.from(set).sort((a, b) => a.localeCompare(b)));
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const okCity = cityFilter === "Alle" ? true : m.city === cityFilter;

      let okRegion = true;
      if (regionFilter !== "Alle") {
        const pt = coordsByCity[m.city];
        if (!pt) okRegion = false;
        else okRegion = regionFromLatLng(pt.lat, pt.lng) === regionFilter;
      }

      const okQ = !q ? true : `${m.label} ${m.city}`.toLowerCase().includes(q);
      return okCity && okRegion && okQ;
    });
  }, [members, query, cityFilter, regionFilter, coordsByCity]);

  const popupMarkers = useMemo(() => {
    if (regionFilter === "Alle") return allCityMarkers;
    return allCityMarkers.filter((m) => m.region === regionFilter);
  }, [allCityMarkers, regionFilter]);

  const previewMarkers = allCityMarkers;

  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const germanyCenter = [51.1657, 10.4515];

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] font-semibold tracking-[0.30em] text-white/60">Bundesweites Netzwerk</p>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Ein starkes Netzwerk - deutschlandweit vertreten
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">
          Unsere Mitglieder sind in allen Regionen Deutschlands aktiv – von Nord bis Süd, von Ost bis West.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-7 ring-1 ring-white/15 min-h-[440px] md:min-h-[500px]">
            <p className="text-sm text-white/80">
              Standorte öffnen sich in einem Popup mit Liste + interaktiver Karte (Hover cards + Cluster).
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-orange-500 px-6 py-3 text-xs font-extrabold tracking-widest text-black hover:bg-orange-400"
              >
                Standorte ansehen
              </button>

              <div className="text-xs text-white/60">
                {previewMarkers.length ? (
                  <>
                    <span className="font-extrabold text-white">{previewMarkers.length}</span> Städte
                  </>
                ) : (
                  "Pins werden geladen…"
                )}
                {missingCities.length ? <span className="ml-2 text-white/35">({missingCities.length} fehlen)</span> : null}
              </div>
            </div>
          </div>

          <div
            className={[
              "relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10",
              modalOpen ? "opacity-25 blur-[2px] pointer-events-none" : "",
            ].join(" ")}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.20),transparent_55%)]" />

            <div className="relative h-[440px] md:h-[500px]">
              <MapContainer center={germanyCenter} zoom={5} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer url={tileUrl} />
                <InvalidateSize when />
                {!!previewMarkers.length && <FitToMarkers markers={previewMarkers} padding={[90, 90]} />}
                <ClusterLayer markers={previewMarkers} />
              </MapContainer>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white">Mitglieder von Frankfurt Intern e.V.</div>
              <div className="mt-1 text-sm text-white/60">Filtere nach Region, Standort oder suche nach Name/Ort.</div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/15 ring-1 ring-white/10"
            >
              Schließen
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche (Name / Stadt)..."
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            />

            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setSelectedCity(null);
              }}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            >
              {regions.map((r) => (
                <option key={r} value={r} className="bg-zinc-950">
                  {r === "Alle" ? "Region: Alle" : `Region: ${r}`}
                </option>
              ))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setSelectedCity(null);
              }}
              className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-zinc-950">
                  {c === "Alle" ? "Stadt: Alle" : `Stadt: ${c}`}
                </option>
              ))}
            </select>

            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70 ring-1 ring-white/10">
              {filtered.length} Ergebnisse
            </div>
          </div>
        </div>

        <div className="grid max-h-[82vh] grid-cols-1 md:grid-cols-2">
          <div className="border-b border-white/10 md:border-b-0 md:border-r border-white/10">
            <div className="max-h-[82vh] overflow-auto p-4">
              <div className="grid gap-2">
                {filtered.map((m, idx) => {
                  const pt = coordsByCity[m.city];
                  const region = pt ? regionFromLatLng(pt.lat, pt.lng) : "—";
                  return (
                    <button
                      key={`${m.label}-${m.city}-${idx}`}
                      type="button"
                      onClick={() => pt && setSelectedCity({ city: m.city, lat: pt.lat, lng: pt.lng })}
                      className="w-full text-left flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 transition bg-white/5 ring-white/10 hover:bg-white/10"
                      disabled={!pt}
                    >
                      <div>
                        <div className="text-sm font-extrabold text-white">{m.label}</div>
                        <div className="mt-0.5 text-xs font-semibold text-white/60">
                          {m.city} <span className="text-white/35">•</span> {region}
                        </div>
                      </div>
                      {m.url ? (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-full bg-orange-500 px-4 py-2 text-[11px] font-extrabold tracking-widest text-black hover:bg-orange-400"
                        >
                          Öffnen
                        </a>
                      ) : (
                        <div className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-widest text-white/50">
                          Bald
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="h-[82vh]">
              <MapContainer center={[51.1657, 10.4515]} zoom={6} scrollWheelZoom className="h-full w-full">
                <TileLayer url={tileUrl} />
                <InvalidateSize when={modalOpen} />
                {!!popupMarkers.length && <FitToMarkers markers={popupMarkers} padding={[90, 90]} />}
                <FlyTo target={selectedCity} />
                <ClusterLayer
                  markers={popupMarkers}
                  onCitySelect={(m) => setSelectedCity({ city: m.city, lat: m.lat, lng: m.lng })}
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
