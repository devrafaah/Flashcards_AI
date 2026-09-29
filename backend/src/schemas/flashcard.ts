import { z } from "zod";

export const FlashcardSchema = z.object({
  pergunta:    z.string().min(10, "Pergunta muito curta"),
  resposta:    z.string().min(10, "Resposta muito curta"),
  pagina:      z.number().int().positive(),
  dificuldade: z.enum(["facil", "medio", "dificil"]),
});

export const DeckResponseSchema = z.object({
  titulo: z.string().min(3),
  cards:  z.array(FlashcardSchema).min(1, "Nenhum card gerado"),
});

export const ChunkCardsSchema = z.object({
  cards: z.array(FlashcardSchema).min(1, "Nenhum card gerado"),
});

export type Flashcard     = z.infer<typeof FlashcardSchema>;
export type DeckResponse  = z.infer<typeof DeckResponseSchema>;