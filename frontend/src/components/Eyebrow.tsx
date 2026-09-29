import type { ReactNode } from "react";

export function Eyebrow({
  icon,
  success,
  children,
}: {
  icon?: ReactNode;
  success?: boolean;
  children: ReactNode;
}) {
  const colors = success
    ? "text-success bg-success-soft border-[rgba(52,211,153,0.25)]"
    : "text-accent-bright bg-accent-soft border-[rgba(129,140,248,0.25)]";

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${colors}`}
    >
      {icon ? (
        <span className="shrink-0 [&_svg]:h-[14px] [&_svg]:w-[14px]">{icon}</span>
      ) : (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            success ? "bg-success shadow-[0_0_10px_rgba(52,211,153,0.40)]" : "bg-accent-bright shadow-[0_0_10px_rgba(99,102,241,0.45)]"
          }`}
        />
      )}
      {children}
    </span>
  );
}
