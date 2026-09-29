import type { ReactNode } from "react";

export function Chip({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-glass-strong border border-glass-border px-4 py-1 text-xs font-semibold text-ink-3 [&_svg]:w-[13px] [&_svg]:h-[13px]">
      {icon}
      {children}
    </span>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-2">{children}</div>;
}
