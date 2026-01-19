const icons = {
  lightbulb: "lightbulb",
  verified_user: "verified_user",
  support_agent: "support_agent",
  visibility: "visibility",
  auto_awesome: "auto_awesome",
  handshake: "handshake",
  rocket_launch: "rocket_launch",
  shield_lock: "shield_lock",
  bolt: "bolt",
  check_circle: "check_circle",
};

export default function Icon({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {icons[name] ?? name}
    </span>
  );
}
