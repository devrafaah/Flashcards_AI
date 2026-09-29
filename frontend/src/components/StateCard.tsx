import type { ReactNode } from "react";

export function StateCard({ children }: { children: ReactNode }) {
  return (
    <div className="motion-safe:animate-rise flex w-full max-w-[560px] flex-col items-center gap-6 rounded-lg border border-glass-border bg-glass p-[clamp(32px,5vw,64px)] text-center shadow-glass-lg backdrop-blur-lg max-sm:px-6 max-sm:py-8">
      {children}
    </div>
  );
}

const iconVariants = {
  accent: "bg-accent-soft border-[rgba(129,140,248,0.3)] text-accent-bright",
  danger: "bg-danger-soft border-[rgba(248,113,113,0.3)] text-danger",
  success: "bg-success-soft border-[rgba(52,211,153,0.3)] text-success",
};

export function StateIcon({
  variant,
  children,
}: {
  variant: keyof typeof iconVariants;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid h-[76px] w-[76px] place-items-center rounded-md border [&_svg]:h-[34px] [&_svg]:w-[34px] ${iconVariants[variant]}`}
    >
      {children}
    </div>
  );
}

export function StateTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[28px] font-extrabold tracking-[-0.03em] max-sm:text-2xl">{children}</h2>;
}

export function StateText({ children }: { children: ReactNode }) {
  return <p className="max-w-[44ch] text-ink-2">{children}</p>;
}

export function StateActions({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex w-full flex-wrap justify-center gap-4 max-sm:flex-col [&>button]:max-w-[280px] [&>button]:flex-[1_1_200px] max-sm:[&>button]:max-w-none max-sm:[&>button]:flex-none max-sm:[&>button]:w-full">
      {children}
    </div>
  );
}
