export type Dificuldade = "facil" | "medio" | "dificil";

export interface Card {
  id: string;
  pergunta: string;
  resposta: string;
  pagina: number;
  dificuldade: Dificuldade;
  deckId: string;
}

export interface Deck {
  id: string;
  titulo: string;
  arquivo: string;
  userId: string;
  createdAt: string;
  cards: Card[];
}

export interface DeckSummary {
  id: string;
  titulo: string;
  arquivo: string;
  createdAt: string;
  _count: { cards: number };
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export type Verdict = "miss" | "hard" | "got";
export type StudyResults = Record<number, Verdict>;
