import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-left" htmlFor={id}>
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">{label}</span>
      <input
        id={id}
        className={`w-full rounded-md border border-glass-border bg-white/5 px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 ease-out placeholder:text-ink-4 focus:border-accent-bright focus:shadow-focus-ring ${className}`}
        {...props}
      />
    </label>
  );
}
