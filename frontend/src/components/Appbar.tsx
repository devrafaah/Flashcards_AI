import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "./icons";

const iconBtn =
  "grid h-10 w-10 place-items-center rounded-full bg-glass border border-glass-border text-ink-2 backdrop-blur-sm transition-all duration-300 ease-out hover:bg-glass-hover hover:text-ink hover:border-glass-bright focus-visible:outline-none focus-visible:shadow-focus-ring [&_svg]:w-[18px] [&_svg]:h-[18px]";

export function Appbar({ right }: { right?: ReactNode }) {
  const navigate = useNavigate();

  return (
    <header className="relative z-[5] flex items-center justify-between gap-6 px-[clamp(24px,5vw,64px)] py-6 max-sm:px-6 max-sm:py-4">
      <div
        className="flex cursor-pointer items-center gap-4"
        role="button"
        tabIndex={0}
        aria-label="Flashcards AI — início"
        onClick={() => navigate("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate("/");
        }}
      >
        <span
          className="grid h-[38px] w-[38px] place-items-center rounded-[11px] text-white max-sm:h-[34px] max-sm:w-[34px]"
          style={{
            background: "linear-gradient(150deg, #6366F1, #4338CA)",
            boxShadow: "0 6px 18px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <Icon.brain size={20} />
        </span>
        <span className="text-base font-bold tracking-[-0.02em]">
          Flashcards<span className="text-accent-bright"> AI</span>
        </span>
      </div>

      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <button
      className={iconBtn}
      title="Sair"
      aria-label="Sair da conta"
      onClick={() => {
        logout();
        navigate("/login");
      }}
    >
      <LogOut strokeWidth={1.8} />
    </button>
  );
}

export function IconLinkButton({
  to,
  label,
  children,
}: {
  to: string;
  label: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <button className={iconBtn} title={label} aria-label={label} onClick={() => navigate(to)}>
      {children}
    </button>
  );
}
