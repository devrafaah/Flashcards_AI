export function SkeletonCard() {
  return (
    <div
      className="relative flex h-[240px] flex-col gap-4 overflow-hidden rounded-lg border border-glass-border bg-glass p-8 shadow-glass backdrop-blur-md"
      aria-hidden="true"
    >
      <div className="h-[22px] w-[60%] rounded-full bg-white/[0.07]" />
      <div className="h-[14px] w-[90%] rounded-full bg-white/[0.07]" />
      <div className="h-[14px] w-[75%] rounded-full bg-white/[0.07]" />
      <div className="h-[14px] w-[60%] rounded-full bg-white/[0.07]" />
      <div className="mt-auto h-[12px] w-[40%] rounded-full bg-white/[0.07]" />
      <div
        className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) 48%, rgba(129,140,248,0.10) 52%, transparent 70%)",
        }}
      />
    </div>
  );
}
