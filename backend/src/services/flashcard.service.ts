import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChunkCardsSchema } from "../schemas/flashcard";
import { createClaudeModel } from "../lib/claude";

export async function gerarFlashcards(textoExtraido: string, titulo: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:    4000,
    chunkOverlap: 400,
  });

  const chunks = await splitter.createDocuments([textoExtraido]);

  const model = createClaudeModel();

  const modelComSchema = model.withStructuredOutput(ChunkCardsSchema);

  const todosCards: any[] = [];

  for (const chunk of chunks) {
    const resultado = await modelComSchema.invoke([
      {
        role: "system",
        content: `Você é um especialista em criar flashcards de estudo acadêmico.
Gere pares de pergunta e resposta a partir do texto fornecido.
Cada card deve ter pergunta clara, resposta completa, número da página estimado e nível de dificuldade.`,
      },
      {
        role: "user",
        content: chunk.pageContent,
      },
    ]);

    todosCards.push(...resultado.cards);
  }

  return { titulo, cards: todosCards };
}