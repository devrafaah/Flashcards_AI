import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "ghost";
  size?: "md" | "sm";
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap border border-transparent transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 [&_svg]:w-[18px] [&_svg]:h-[18px] focus-visible:outline-none focus-visible:shadow-focus-ring";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-white shadow-accent-glow hover:bg-accent-bright hover:-translate-y-0.5 hover:shadow-accent-glow-lg",
  glass:
    "bg-glass-strong text-ink backdrop-blur-sm border-glass-border hover:bg-glass-hover hover:border-glass-bright hover:-translate-y-px",
  ghost: "bg-transparent text-ink-2 hover:text-ink hover:bg-glass",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "min-h-[48px] px-8 py-[14px] text-sm",
  sm: "min-h-[40px] px-6 py-[10px] text-xs",
};

export function Button({
  variant = "glass",
  size = "md",
  icon,
  iconRight,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
