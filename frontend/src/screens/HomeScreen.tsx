import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar, LogoutButton } from "../components/Appbar";
import { Eyebrow } from "../components/Eyebrow";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";
import { StateCard, StateIcon, StateTitle, StateText, StateActions } from "../components/StateCard";
import * as api from "../lib/api";
import type { DeckSummary } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function DeckTile({ deck }: { deck: DeckSummary }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/decks/${deck.id}`)}
      className="group flex flex-col gap-4 rounded-lg border border-glass-border bg-glass-strong p-6 text-left shadow-glass backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-glass-bright hover:bg-glass-hover focus-visible:outline-none focus-visible:shadow-focus-ring"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[rgba(129,140,248,0.3)] bg-accent-soft text-accent-bright">
          <Icon.layers size={18} />
        </span>
        <span className="text-xs text-ink-4">{formatDate(deck.createdAt)}</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-ink line-clamp-2">{deck.titulo}</h3>
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
        <Icon.hash size={14} className="text-ink-3" />
        {deck._count.cards} cards
      </span>
    </button>
  );
}

export function HomeScreen() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<DeckSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .listarDecks()
      .then(setDecks)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <StateCard>
            <StateIcon variant="danger">
              <Icon.alert />
            </StateIcon>
            <StateTitle>Não foi possível carregar seus baralhos</StateTitle>
            <StateText>Verifique sua conexão com o servidor e tente novamente.</StateText>
            <StateActions>
              <Button variant="primary" icon={<Icon.refresh size={18} />} onClick={() => location.reload()}>
                Tentar novamente
              </Button>
            </StateActions>
          </StateCard>
        </div>
      </>
    );
  }

  if (decks === null) {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="flex flex-1 items-center justify-center">
          <span className="spinner h-6 w-6 animate-spin rounded-full border-2 border-accent-soft border-t-accent-bright" />
        </div>
      </>
    );
  }

  if (decks.length === 0) {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <StateCard>
            <StateIcon variant="accent">
              <Icon.inbox />
            </StateIcon>
            <StateTitle>Nenhum baralho ainda</StateTitle>
            <StateText>
              Envie um PDF e a IA cria seu primeiro baralho de flashcards em segundos. Seus baralhos aparecerão
              aqui.
            </StateText>
            <StateActions>
              <Button variant="primary" icon={<Icon.upload size={18} />} onClick={() => navigate("/upload")}>
                Enviar um PDF
              </Button>
            </StateActions>
          </StateCard>
        </div>
      </>
    );
  }

  return (
    <>
      <Appbar right={<LogoutButton />} />
      <div className="motion-safe:animate-screen-in mx-auto w-full max-w-[1180px] flex-1 px-[clamp(24px,5vw,64px)] pb-16 pt-[clamp(24px,4vw,48px)] max-sm:px-6 max-sm:pb-12 max-sm:pt-6">
        <div className="motion-safe:animate-rise mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Seus baralhos</Eyebrow>
            <h1 className="mt-4 text-[28px] font-extrabold tracking-[-0.03em]">Continue de onde parou.</h1>
          </div>
          <Button variant="primary" icon={<Icon.upload size={18} />} onClick={() => navigate("/upload")}>
            Novo baralho
          </Button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 max-sm:grid-cols-1 max-sm:gap-4">
          {decks.map((deck, i) => (
            <div key={deck.id} className="motion-safe:animate-rise" style={{ animationDelay: `${0.06 + i * 0.04}s` }}>
              <DeckTile deck={deck} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
