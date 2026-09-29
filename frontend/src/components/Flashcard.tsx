import { useState, type KeyboardEvent } from "react";
import type { Card } from "../types";
import { Icon } from "./icons";

const face =
  "absolute inset-0 backface-hidden flex flex-col p-8 max-sm:p-6 rounded-lg border border-glass-border bg-glass-strong backdrop-blur-lg shadow-glass-lg transition-opacity duration-[10ms] delay-[350ms]";

export function Flashcard({ card, index }: { card: Card; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className="h-[240px] max-sm:h-[210px] perspective-1600 cursor-pointer group focus-visible:outline-none"
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`Card ${index + 1}. ${flipped ? "Resposta" : "Pergunta"}: ${
        flipped ? card.resposta : card.pergunta
      }. Pressione Enter para virar.`}
      onClick={toggle}
      onKeyDown={onKey}
    >
      <div
        className={`flip-inner preserve-3d relative h-full w-full transition-transform duration-700 ease-out ${
          flipped
            ? "[transform:rotateY(180deg)] group-hover:[transform:rotateY(180deg)_translateY(-4px)]"
            : "group-hover:[transform:translateY(-4px)]"
        }`}
      >
        <div
          className={`${face} group-focus-visible:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_3px_rgba(99,102,241,0.45)] ${
            flipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="glass-sheen" />
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3">Pergunta</span>
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full border border-glass-border text-xs font-semibold text-ink-3">
              {index + 1}
            </span>
          </div>
          <div className="flex-1 flex items-center overflow-hidden text-lg max-sm:text-[1.0625rem] font-semibold leading-[1.4] text-ink">
            {card.pergunta}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-2">
            <Icon.checkCircle size={14} className="shrink-0" /> Toque para revelar
          </div>
        </div>

        <div
          className={`${face} rotate-y-180 border-[rgba(129,140,248,0.30)] group-focus-visible:shadow-[0_16px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_3px_rgba(99,102,241,0.45)] ${
            flipped ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(160deg, rgba(99,102,241,0.16), transparent 70%), rgba(255,255,255,0.075)",
          }}
        >
          <span className="glass-sheen" />
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent-bright">Resposta</span>
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full border border-glass-border text-xs font-semibold text-ink-3">
              {index + 1}
            </span>
          </div>
          <div className="flex-1 flex items-center overflow-hidden text-[0.9375rem] font-medium leading-[1.5] text-ink">
            {card.resposta}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-2">
            <Icon.pin size={14} className="shrink-0" /> Fonte · pág. {card.pagina} do PDF
          </div>
        </div>
      </div>
    </div>
  );
}
