import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { Icon } from "./icons";
import { Chip, ChipRow } from "./Chip";

const activeUtilities =
  "border-accent-bright bg-glass-hover -translate-y-0.5 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_4px_rgba(99,102,241,0.16),inset_0_1px_0_rgba(255,255,255,0.14)]";

export function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const prevent = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const open = () => inputRef.current?.click();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      className={`relative flex w-full max-w-[640px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-dashed border-glass-bright bg-glass px-8 py-[clamp(48px,6vw,96px)] text-center shadow-glass-lg backdrop-blur-lg transition-all duration-[400ms] ease-out max-sm:px-4 max-sm:py-12 hover:border-accent-bright hover:bg-glass-hover hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_4px_rgba(99,102,241,0.16),inset_0_1px_0_rgba(255,255,255,0.14)] focus-visible:outline-none focus-visible:border-accent-bright focus-visible:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_4px_rgba(99,102,241,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] ${
        drag ? activeUtilities : ""
      }`}
      role="button"
      tabIndex={0}
      aria-label="Área de upload de PDF. Arraste um arquivo ou pressione Enter para selecionar."
      onClick={open}
      onKeyDown={onKeyDown}
      onDragEnter={(e) => {
        prevent(e);
        setDrag(true);
      }}
      onDragOver={(e) => {
        prevent(e);
        setDrag(true);
      }}
      onDragLeave={(e) => {
        prevent(e);
        setDrag(false);
      }}
      onDrop={(e) => {
        prevent(e);
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <div
        className={`mb-6 grid h-[68px] w-[68px] place-items-center rounded-md border border-[rgba(129,140,248,0.3)] bg-accent-soft text-accent-bright transition-transform duration-[400ms] ease-out max-sm:h-[60px] max-sm:w-[60px] ${
          drag ? "-translate-y-1 scale-105" : ""
        }`}
      >
        <Icon.upload size={30} />
      </div>
      <div className="mb-2 text-xl font-bold">
        Arraste seu <span className="text-accent-bright">PDF</span> aqui
      </div>
      <div className="max-w-[42ch] text-sm text-ink-2">
        ou clique para selecionar · a IA extrai e estrutura os flashcards
      </div>
      <div className="mt-6">
        <ChipRow>
          <Chip icon={<Icon.file />}>PDF</Chip>
          <Chip>até 50 MB</Chip>
          <Chip icon={<Icon.layers />}>multipágina</Chip>
        </ChipRow>
      </div>
    </div>
  );
}
