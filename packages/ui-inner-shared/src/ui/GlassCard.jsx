export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white/70 dark:bg-[#190f23]/70 backdrop-blur-xl 
      border border-white/30 dark:border-primary/20 rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}
