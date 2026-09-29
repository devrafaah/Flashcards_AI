import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Eyebrow } from "../components/Eyebrow";
import { StateCard, StateTitle, StateText, StateActions } from "../components/StateCard";
import { Icon } from "../components/icons";
import type { Card, StudyResults } from "../types";

interface LocationState {
  results?: StudyResults;
  cards?: Card[];
  deckTitle?: string;
}

export function CompleteScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};

  useEffect(() => {
    if (!state.results || !state.cards) {
      navigate(`/decks/${id}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state.results || !state.cards) return null;

  const { results, cards, deckTitle = "" } = state;
  const vals = Object.values(results);
  const got = vals.filter((v) => v === "got").length;
  const hard = vals.filter((v) => v === "hard").length;
  const miss = vals.filter((v) => v === "miss").length;
  const reviewed = vals.length || cards.length;
  const pct = Math.round((got / reviewed) * 100) || 0;
  const C = 2 * Math.PI * 56;

  const restart = (onlyHard: boolean) => {
    if (onlyHard) {
      const hardCards = cards.filter((_, i) => results[i] === "hard" || results[i] === "miss");
      navigate(`/decks/${id}/study`, {
        replace: true,
        state: { subset: hardCards.length ? hardCards : cards, deckTitle },
      });
    } else {
      navigate(`/decks/${id}/study`, { replace: true, state: { subset: cards, deckTitle } });
    }
  };

  return (
    <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <StateCard>
        <Eyebrow success icon={<Icon.checkCircle />}>
          Sessão concluída
        </Eyebrow>

        <div className="relative h-[132px] w-[132px]" role="img" aria-label={`Aproveitamento ${pct} por cento`}>
          <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
            <circle cx="66" cy="66" r="56" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="66"
              cy="66"
              r="56"
              fill="none"
              stroke="#34D399"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (C * pct) / 100}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)",
                filter: "drop-shadow(0 0 6px rgba(52,211,153,0.40))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none">{pct}%</span>
            <span className="mt-0.5 text-xs text-ink-3">aproveitamento</span>
          </div>
        </div>

        <StateTitle>Bom trabalho.</StateTitle>
        <StateText>
          Você revisou {reviewed} de {cards.length} cards de <b className="text-ink">{deckTitle}</b>.
          {miss + hard > 0
            ? ` Sugerimos rever ${miss + hard} card${miss + hard > 1 ? "s" : ""} marcado${
                miss + hard > 1 ? "s" : ""
              } como difícil ou errado.`
            : " Você acertou tudo — revise novamente em alguns dias para fixar."}
        </StateText>

        <div className="mt-2 grid w-full grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 rounded-md border border-glass-border bg-glass-strong p-6">
            <span className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-success [font-variant-numeric:tabular-nums]">
              {got}
            </span>
            <span className="text-xs font-medium text-ink-3">Acertei</span>
          </div>
          <div className="flex flex-col gap-1 rounded-md border border-glass-border bg-glass-strong p-6">
            <span className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-warn [font-variant-numeric:tabular-nums]">
              {hard}
            </span>
            <span className="text-xs font-medium text-ink-3">Difícil</span>
          </div>
          <div className="flex flex-col gap-1 rounded-md border border-glass-border bg-glass-strong p-6">
            <span className="text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-ink [font-variant-numeric:tabular-nums]">
              {miss}
            </span>
            <span className="text-xs font-medium text-ink-3">Errei</span>
          </div>
        </div>

        <StateActions>
          {miss + hard > 0 ? (
            <Button variant="primary" icon={<Icon.rotate size={18} />} onClick={() => restart(true)}>
              Revisar os difíceis
            </Button>
          ) : (
            <Button variant="primary" icon={<Icon.refresh size={18} />} onClick={() => restart(false)}>
              Estudar novamente
            </Button>
          )}
          <Button variant="glass" icon={<Icon.layers size={18} />} onClick={() => navigate(`/decks/${id}`)}>
            Voltar ao baralho
          </Button>
        </StateActions>
      </StateCard>
    </div>
  );
}
