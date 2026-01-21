export default function Footer({ left, right }) {
  return (
    <footer className="border-t py-16 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex justify-between">
        <span>{left ?? ""}</span>
        <span>{right ?? ""}</span>
      </div>
    </footer>
  );
}
