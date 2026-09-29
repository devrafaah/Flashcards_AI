import type { Deck, DeckSummary, User } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function registrar(email: string, senha: string) {
  return request<{ token: string }>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
    auth: false,
  });
}

export function login(email: string, senha: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
    auth: false,
  });
}

export function me() {
  return request<User>("/auth/me");
}

export function listarDecks() {
  return request<DeckSummary[]>("/decks");
}

export function obterDeck(id: string) {
  return request<Deck>(`/decks/${id}`);
}

export function criarDeck(arquivo: File, titulo?: string) {
  const form = new FormData();
  form.append("arquivo", arquivo);
  if (titulo) form.append("titulo", titulo);

  return request<Deck>("/decks", {
    method: "POST",
    body: form,
  });
}
