export function ProgressBar({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(99,102,241,0.45)" }}
      />
    </div>
  );
}
