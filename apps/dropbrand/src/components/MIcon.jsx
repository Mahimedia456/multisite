export default function MIcon({ name, className = "" }) {
  return (
    <span
      className={["material-symbols-outlined leading-none select-none", className].join(" ")}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}