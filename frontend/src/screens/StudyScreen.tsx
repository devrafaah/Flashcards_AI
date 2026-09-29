import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { Icon } from "../components/icons";
import * as api from "../lib/api";
import type { Card, StudyResults, Verdict } from "../types";

interface LocationState {
  subset?: Card[];
  deckTitle?: string;
}

const faceBase =
  "absolute inset-0 backface-hidden flex flex-col p-[clamp(32px,4vw,64px)] rounded-lg border border-glass-border bg-glass-strong backdrop-blur-lg shadow-glass-lg transition-opacity duration-[10ms] delay-[350ms]";

export function StudyScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};

  const [cards, setCards] = useState<Card[] | null>(state.subset ?? null);
  const [deckTitle, setDeckTitle] = useState(state.deckTitle ?? "");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const resultsRef = useRef<StudyResults>({});
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cards || !id) return;
    api.obterDeck(id).then((deck) => {
      setCards(deck.cards);
      setDeckTitle(deck.titulo);
    });
  }, [cards, id]);

  const total = cards?.length ?? 0;
  const card = cards?.[idx];
  const progress = total ? ((idx + (flipped ? 0.5 : 0)) / total) * 100 : 0;

  const go = useCallback(
    (dir: number) => {
      setFlipped(false);
      setIdx((i) => Math.max(0, Math.min(total - 1, i + dir)));
    },
    [total]
  );

  const grade = useCallback(
    (verdict: Verdict) => {
      const final = { ...resultsRef.current, [idx]: verdict };
      resultsRef.current = final;
      if (idx >= total - 1) {
        navigate(`/decks/${id}/done`, {
          replace: true,
          state: { results: final, cards, deckTitle },
        });
      } else {
        go(1);
      }
    },
    [idx, total, go, navigate, id, cards, deckTitle]
  );

  useEffect(() => {
    if (!total) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "Escape") {
        navigate(`/decks/${id}`);
      } else if (flipped && e.key === "1") grade("miss");
      else if (flipped && e.key === "2") grade("hard");
      else if (flipped && e.key === "3") grade("got");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, grade, flipped, navigate, id, total]);

  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    cardRef.current?.focus();
  }, [idx]);

  if (!cards || !card) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <span className="spinner h-6 w-6 animate-spin rounded-full border-2 border-accent-soft border-t-accent-bright" />
      </div>
    );
  }

  return (
    <div
      className="motion-safe:animate-screen-in fixed inset-0 z-40 flex flex-col"
      role="dialog"
      aria-label="Modo de estudo"
    >
      <div className="flex items-center gap-6 px-[clamp(24px,5vw,64px)] py-6 max-sm:px-6 max-sm:py-4">
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-glass-border bg-glass text-ink-2 backdrop-blur-sm transition-all duration-300 ease-out hover:bg-glass-hover hover:text-ink hover:border-glass-bright focus-visible:outline-none focus-visible:shadow-focus-ring [&_svg]:h-[18px] [&_svg]:w-[18px]"
          aria-label="Sair do modo de estudo"
          onClick={() => navigate(`/decks/${id}`)}
        >
          <Icon.close />
        </button>
        <div className="flex flex-1 items-center gap-4">
          <ProgressBar value={progress} />
        </div>
        <span className="whitespace-nowrap text-xs font-semibold text-ink-3 [font-variant-numeric:tabular-nums]">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-4 pb-12 max-sm:justify-between max-sm:gap-4 max-sm:px-4 max-sm:pb-4 max-sm:pt-3">
        <div
          ref={cardRef}
          className="perspective-2200 h-[min(420px,56vh)] w-[min(680px,92vw)] cursor-pointer group focus-visible:outline-none max-sm:h-auto max-sm:min-h-[320px] max-sm:max-h-[520px] max-sm:w-full max-sm:flex-1"
          role="button"
          tabIndex={0}
          aria-label={`${flipped ? "Resposta" : "Pergunta"} ${idx + 1} de ${total}: ${
            flipped ? card.resposta : card.pergunta
          }`}
          onClick={() => setFlipped((f) => !f)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`flip-inner preserve-3d relative h-full w-full transition-transform duration-700 ease-out ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className={`${faceBase} ${flipped ? "opacity-0" : "opacity-100"}`}>
              <span className="glass-sheen" />
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3">Pergunta</span>
                <span className="hidden items-center gap-2 text-xs text-ink-3 sm:inline-flex">
                  <Icon.flip size={14} /> espaço para virar
                </span>
              </div>
              <div className="flex-1 overflow-auto text-[clamp(1.375rem,3vw,1.75rem)] font-bold tracking-[-0.02em] leading-[1.3] text-ink">
                {card.pergunta}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-ink-2">
                <Icon.book size={14} className="shrink-0" /> {deckTitle}
              </div>
            </div>
            <div
              className={`${faceBase} rotate-y-180 border-[rgba(129,140,248,0.30)] ${
                flipped ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(160deg, rgba(99,102,241,0.16), transparent 70%), rgba(255,255,255,0.075)",
              }}
            >
              <span className="glass-sheen" />
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent-bright">Resposta</span>
                <span className="hidden items-center gap-2 text-xs text-ink-3 sm:inline-flex">
                  <Icon.flip size={14} /> espaço para virar
                </span>
              </div>
              <div className="flex-1 overflow-auto text-[clamp(1.0625rem,2vw,1.25rem)] font-medium tracking-[-0.01em] leading-[1.5] text-ink">
                {card.resposta}
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-ink-2">
                <Icon.pin size={14} className="shrink-0" /> Fonte · pág. {card.pagina} do PDF
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[min(680px,92vw)] flex-col items-center gap-6 max-sm:w-full max-sm:gap-4">
          <div
            className={`flex w-full justify-center gap-4 transition-all duration-400 ease-out max-sm:gap-2 ${
              flipped ? "" : "pointer-events-none translate-y-2 opacity-0"
            }`}
            aria-hidden={!flipped}
          >
            <button
              className="inline-flex min-h-[50px] min-w-[132px] items-center justify-center gap-2 rounded-full border border-glass-border bg-glass-strong px-8 py-[14px] text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-300 ease-out hover:border-[rgba(248,113,113,0.5)] hover:bg-danger-soft hover:text-danger max-sm:min-w-0 max-sm:min-h-16 max-sm:flex-1 max-sm:flex-col max-sm:gap-1 max-sm:rounded-md max-sm:px-2 max-sm:py-3 max-sm:text-xs"
              disabled={!flipped}
              onClick={() => grade("miss")}
            >
              <Icon.x size={16} /> Errei
              <span className="ml-0.5 rounded-[5px] border border-glass-border px-1.5 text-[11px] font-semibold text-ink-4 max-sm:hidden">
                1
              </span>
            </button>
            <button
              className="inline-flex min-h-[50px] min-w-[132px] items-center justify-center gap-2 rounded-full border border-glass-border bg-glass-strong px-8 py-[14px] text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-300 ease-out hover:border-[rgba(251,191,36,0.5)] hover:bg-warn-soft hover:text-warn max-sm:min-w-0 max-sm:min-h-16 max-sm:flex-1 max-sm:flex-col max-sm:gap-1 max-sm:rounded-md max-sm:px-2 max-sm:py-3 max-sm:text-xs"
              disabled={!flipped}
              onClick={() => grade("hard")}
            >
              <Icon.bolt size={16} /> Difícil
              <span className="ml-0.5 rounded-[5px] border border-glass-border px-1.5 text-[11px] font-semibold text-ink-4 max-sm:hidden">
                2
              </span>
            </button>
            <button
              className="inline-flex min-h-[50px] min-w-[132px] items-center justify-center gap-2 rounded-full border border-[rgba(52,211,153,0.4)] bg-success-soft px-8 py-[14px] text-sm font-semibold text-success backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-success hover:bg-[rgba(52,211,153,0.22)] hover:shadow-success-glow max-sm:min-w-0 max-sm:min-h-16 max-sm:flex-1 max-sm:flex-col max-sm:gap-1 max-sm:rounded-md max-sm:px-2 max-sm:py-3 max-sm:text-xs"
              disabled={!flipped}
              onClick={() => grade("got")}
            >
              <Icon.check size={16} /> Acertei
              <span className="ml-0.5 rounded-[5px] border border-glass-border px-1.5 text-[11px] font-semibold text-ink-4 max-sm:hidden">
                3
              </span>
            </button>
          </div>

          <div className="flex items-center gap-6 max-sm:w-full max-sm:justify-between">
            <button
              className="grid h-12 w-12 place-items-center rounded-full border border-glass-border bg-glass text-ink-2 transition-all duration-300 ease-out hover:bg-glass-hover hover:text-ink hover:border-glass-bright disabled:opacity-35 disabled:cursor-not-allowed [&_svg]:h-5 [&_svg]:w-5"
              aria-label="Card anterior"
              disabled={idx === 0}
              onClick={() => go(-1)}
            >
              <Icon.arrowLeft />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-4 max-sm:hidden">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded-[5px] border border-glass-border bg-glass px-[7px] py-0.5 text-[11px] font-semibold leading-none text-ink-3">
                  ←
                </kbd>
                <kbd className="rounded-[5px] border border-glass-border bg-glass px-[7px] py-0.5 text-[11px] font-semibold leading-none text-ink-3">
                  →
                </kbd>{" "}
                navegar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded-[5px] border border-glass-border bg-glass px-[7px] py-0.5 text-[11px] font-semibold leading-none text-ink-3">
                  espaço
                </kbd>{" "}
                virar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded-[5px] border border-glass-border bg-glass px-[7px] py-0.5 text-[11px] font-semibold leading-none text-ink-3">
                  esc
                </kbd>{" "}
                sair
              </span>
            </div>
            <span className="hidden items-center gap-1.5 text-xs text-ink-3 max-sm:inline-flex">
              <Icon.flip size={14} /> toque para virar · deslize para navegar
            </span>
            <button
              className="grid h-12 w-12 place-items-center rounded-full border border-glass-border bg-glass text-ink-2 transition-all duration-300 ease-out hover:bg-glass-hover hover:text-ink hover:border-glass-bright disabled:opacity-35 disabled:cursor-not-allowed [&_svg]:h-5 [&_svg]:w-5"
              aria-label="Próximo card"
              disabled={idx === total - 1}
              onClick={() => go(1)}
            >
              <Icon.arrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
