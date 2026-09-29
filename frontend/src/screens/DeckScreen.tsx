import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appbar, LogoutButton, IconLinkButton } from "../components/Appbar";
import { DeckHeader } from "../components/DeckHeader";
import { Chip, ChipRow } from "../components/Chip";
import { Button } from "../components/Button";
import { Flashcard } from "../components/Flashcard";
import { StateCard, StateIcon, StateTitle, StateText, StateActions } from "../components/StateCard";
import { Icon } from "../components/icons";
import * as api from "../lib/api";
import type { Deck } from "../types";

function exportarDeck(deck: Deck) {
  const linhas = deck.cards.map(
    (c, i) => `${i + 1}. Pergunta: ${c.pergunta}\n   Resposta: ${c.resposta}\n   Página: ${c.pagina}\n`
  );
  const conteudo = `${deck.titulo}\n${"=".repeat(deck.titulo.length)}\n\n${linhas.join("\n")}`;
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${deck.titulo.replace(/[^\w-]+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DeckScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [title, setTitle] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .obterDeck(id)
      .then((d) => {
        setDeck(d);
        setTitle(d.titulo);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <StateCard>
            <StateIcon variant="danger">
              <Icon.alert />
            </StateIcon>
            <StateTitle>Baralho não encontrado</StateTitle>
            <StateText>Ele pode ter sido removido ou você não tem acesso a ele.</StateText>
            <StateActions>
              <Button variant="primary" icon={<Icon.layers size={18} />} onClick={() => navigate("/")}>
                Voltar aos baralhos
              </Button>
            </StateActions>
          </StateCard>
        </div>
      </>
    );
  }

  if (!deck) {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="flex flex-1 items-center justify-center">
          <span className="spinner h-6 w-6 animate-spin rounded-full border-2 border-accent-soft border-t-accent-bright" />
        </div>
      </>
    );
  }

  const pages = deck.cards.reduce((max, c) => Math.max(max, c.pagina), 0);
  const minutos = Math.ceil(deck.cards.length * 0.6);

  return (
    <>
      <Appbar
        right={
          <>
            <IconLinkButton to="/" label="Meus baralhos">
              <Icon.layers />
            </IconLinkButton>
            <LogoutButton />
          </>
        }
      />
      <div className="motion-safe:animate-screen-in mx-auto w-full max-w-[1180px] flex-1 px-[clamp(24px,5vw,64px)] pb-16 pt-[clamp(24px,4vw,48px)] max-sm:px-6 max-sm:pb-12 max-sm:pt-6">
        <DeckHeader
          title={title}
          onTitle={setTitle}
          count={deck.cards.length}
          pages={pages}
          onExport={() => exportarDeck({ ...deck, titulo: title })}
        />

        <div
          className="motion-safe:animate-rise mb-10 flex flex-wrap items-center justify-between gap-6"
          style={{ animationDelay: ".06s" }}
        >
          <ChipRow>
            <Chip icon={<Icon.checkCircle />}>Revisado pela IA</Chip>
            <Chip icon={<Icon.clock />}>~{minutos} min de estudo</Chip>
          </ChipRow>
          <Button
            variant="primary"
            icon={<Icon.play size={18} />}
            className="max-sm:w-full"
            onClick={() => navigate(`/decks/${deck.id}/study`)}
          >
            Iniciar estudo
          </Button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] max-sm:grid-cols-1 max-sm:gap-4">
          {deck.cards.map((c, i) => (
            <div key={c.id} className="motion-safe:animate-rise" style={{ animationDelay: `${0.08 + i * 0.04}s` }}>
              <Flashcard card={c} index={i} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
