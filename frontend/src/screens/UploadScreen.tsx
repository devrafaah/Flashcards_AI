import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar, LogoutButton } from "../components/Appbar";
import { Eyebrow } from "../components/Eyebrow";
import { Button } from "../components/Button";
import { Dropzone } from "../components/Dropzone";
import { SkeletonCard } from "../components/SkeletonCard";
import { StateCard, StateIcon, StateTitle, StateText, StateActions } from "../components/StateCard";
import { Chip } from "../components/Chip";
import { Icon } from "../components/icons";
import * as api from "../lib/api";
import { ApiError } from "../lib/api";

const STEPS = ["Analisando documento", "Extraindo conceitos-chave", "Estruturando flashcards"];

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function prefersReduced() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function ProcessingPanel({ fileName }: { fileName: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const per = prefersReduced() ? 500 : 1150;
    const t1 = setTimeout(() => setActive(1), per);
    const t2 = setTimeout(() => setActive(2), per * 2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="motion-safe:animate-screen-in flex flex-1 flex-col pt-12">
      <div className="flex w-full flex-col items-center">
        <Eyebrow icon={<Icon.spark />}>Processando com IA</Eyebrow>
        <div className="mt-6 inline-flex items-center gap-4 text-left text-sm font-semibold text-ink-2">
          <span className="spinner h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-accent-soft border-t-accent-bright" />
          <span className="text-pretty">
            Analisando <b className="font-semibold text-ink">{fileName}</b>{" "}
            <span className="text-ink-3">e estruturando flashcards…</span>
          </span>
        </div>

        <div className="mt-8 flex w-full max-w-[420px] flex-col gap-2" role="list">
          {STEPS.map((label, i) => {
            const state = i < active ? "done" : i === active ? "active" : "pending";
            return (
              <div
                key={label}
                role="listitem"
                aria-current={state === "active" ? "step" : undefined}
                className={`flex items-center gap-4 rounded-md border border-transparent px-6 py-4 text-sm font-medium transition-all duration-500 ease-out ${
                  state === "active"
                    ? "border-glass-border bg-glass text-ink"
                    : state === "done"
                      ? "text-ink-2"
                      : "text-ink-3"
                }`}
              >
                <span
                  className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-500 ease-out [&_svg]:h-3 [&_svg]:w-3 ${
                    state === "done"
                      ? "border-success bg-success text-[#06281C]"
                      : state === "active"
                        ? "border-accent-bright shadow-[0_0_0_4px_rgba(99,102,241,0.16)]"
                        : "border-glass-border"
                  }`}
                >
                  {state === "done" ? <Icon.check /> : null}
                </span>
                <span className="flex-1">{label}</span>
                {state === "active" ? (
                  <span className="step-spinner h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-accent-soft border-t-accent-bright" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-[980px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <p className="mt-8 text-center text-sm text-ink-3">
        Mantenha a calma — isto leva apenas alguns segundos. Você pode fechar e voltar depois.
      </p>
    </div>
  );
}

export function UploadScreen() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const generate = async () => {
    if (!file || submittingRef.current) return;
    submittingRef.current = true;
    setStatus("submitting");
    try {
      const deck = await api.criarDeck(file);
      navigate(`/decks/${deck.id}`, { replace: true });
    } catch (err) {
      submittingRef.current = false;
      setStatus("error");
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : "O arquivo pode estar protegido, ser apenas imagem (sem texto selecionável) ou ter excedido 50 MB."
      );
    }
  };

  if (status === "submitting") {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="mx-auto w-full max-w-[1180px] flex-1 px-[clamp(24px,5vw,64px)] pb-16 max-sm:px-6">
          <ProcessingPanel fileName={file?.name ?? "documento.pdf"} />
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Appbar right={<LogoutButton />} />
        <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <StateCard>
            <StateIcon variant="danger">
              <Icon.alert />
            </StateIcon>
            <StateTitle>Não conseguimos ler esse PDF</StateTitle>
            <StateText>{errorMsg} Nada se perdeu — tente outro arquivo ou envie novamente.</StateText>
            <div className="flex flex-wrap justify-center gap-2">
              <Chip icon={<Icon.file />}>PDF com texto</Chip>
              <Chip>até 50 MB</Chip>
            </div>
            <StateActions>
              <Button
                variant="primary"
                icon={<Icon.refresh size={18} />}
                onClick={() => {
                  setFile(null);
                  setStatus("idle");
                }}
              >
                Tentar novamente
              </Button>
              <Button variant="ghost" onClick={() => navigate("/")}>
                Voltar ao início
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
      <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="motion-safe:animate-rise" style={{ animationDelay: ".02s" }}>
          <Eyebrow>Flashcards AI · estude com foco</Eyebrow>
        </span>
        <h1
          className="motion-safe:animate-rise mt-6 max-w-[16ch] text-display font-extrabold"
          style={{ animationDelay: ".08s" }}
        >
          Transforme qualquer PDF em flashcards.
        </h1>
        <p className="motion-safe:animate-rise mt-4 max-w-[54ch] text-[1.0625rem] text-ink-2 max-sm:text-base" style={{ animationDelay: ".14s" }}>
          A IA lê o documento, extrai os conceitos-chave e estrutura um baralho pronto para revisão — você só
          estuda.
        </p>

        <div className="motion-safe:animate-rise mt-12 flex w-full justify-center" style={{ animationDelay: ".2s" }}>
          {!file ? (
            <Dropzone onFile={setFile} />
          ) : (
            <div
              className="flex w-full max-w-[640px] cursor-default flex-col items-center rounded-lg border-[1.5px] border-dashed border-glass-bright bg-glass px-8 py-12 text-center shadow-glass-lg backdrop-blur-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inline-flex items-center gap-4 rounded-md border border-glass-border bg-glass-strong px-6 py-4 backdrop-blur-sm">
                <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent-soft text-accent-bright">
                  <Icon.file size={20} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-ink">{file.name}</span>
                  <span className="block text-xs text-ink-3">{formatSize(file.size)} · pronto para processar</span>
                </span>
              </div>
              <div className="mt-6 max-w-[42ch] text-sm text-ink-2">
                Documento carregado. A IA vai analisar todas as páginas e propor um baralho.
              </div>
              <button
                className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-[10px] text-xs font-semibold text-ink-2 transition-colors hover:bg-glass hover:text-ink"
                onClick={() => setFile(null)}
              >
                <Icon.refresh size={16} /> Trocar arquivo
              </button>
            </div>
          )}
        </div>

        <div
          className="motion-safe:animate-rise mt-12 flex flex-wrap justify-center gap-4 max-sm:w-full max-sm:flex-col"
          style={{ animationDelay: ".26s" }}
        >
          <Button variant="primary" icon={<Icon.spark size={18} />} disabled={!file} onClick={generate}>
            Gerar flashcards
          </Button>
        </div>
      </div>
    </>
  );
}
