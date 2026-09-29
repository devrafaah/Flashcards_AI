import { useRef } from "react";
import { Icon } from "./icons";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";

interface DeckHeaderProps {
  title: string;
  onTitle: (value: string) => void;
  count: number;
  pages: number;
  onExport: () => void;
}

export function DeckHeader({ title, onTitle, count, pages, onExport }: DeckHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="motion-safe:animate-rise mb-12 flex flex-wrap items-start justify-between gap-6 max-sm:mb-8">
      <div className="flex min-w-0 flex-col gap-4">
        <Eyebrow>Baralho gerado</Eyebrow>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            aria-label="Nome do baralho (editável)"
            spellCheck={false}
            className="min-w-[200px] border-b-[1.5px] border-transparent bg-transparent px-1 py-0.5 font-sans text-[28px] font-extrabold tracking-[-0.03em] text-ink transition-colors duration-300 ease-out hover:border-b-glass-border focus:border-b-accent-bright focus:outline-none max-sm:w-full max-sm:min-w-0 max-sm:text-2xl"
          />
          <span className="inline-flex text-ink-4" title="Clique para renomear">
            <Icon.edit size={16} />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
            <Icon.hash size={15} className="text-ink-3" />
            {count} cards
          </span>
          <span className="h-1 w-1 rounded-full bg-ink-4" />
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
            <Icon.book size={15} className="text-ink-3" />
            {pages} páginas
          </span>
          <span className="h-1 w-1 rounded-full bg-ink-4" />
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
            <Icon.spark size={15} className="text-ink-3" />
            Gerado por IA
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 max-sm:w-full [&>button]:max-sm:flex-1">
        <Button variant="glass" size="sm" icon={<Icon.edit size={16} />} onClick={() => inputRef.current?.focus()}>
          Editar
        </Button>
        <Button variant="glass" size="sm" icon={<Icon.download size={16} />} onClick={onExport}>
          Exportar
        </Button>
      </div>
    </div>
  );
}
