import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";
import { Eyebrow } from "../components/Eyebrow";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, senha);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="motion-safe:animate-screen-in flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="motion-safe:animate-rise" style={{ animationDelay: ".02s" }}>
        <Eyebrow icon={<Icon.brain />}>Flashcards AI</Eyebrow>
      </span>
      <h1
        className="motion-safe:animate-rise mt-6 text-[28px] font-extrabold tracking-[-0.03em]"
        style={{ animationDelay: ".08s" }}
      >
        Bem-vindo de volta.
      </h1>
      <p className="motion-safe:animate-rise mt-3 max-w-[40ch] text-ink-2" style={{ animationDelay: ".12s" }}>
        Entre para continuar estudando seus baralhos.
      </p>

      <form
        onSubmit={onSubmit}
        className="motion-safe:animate-rise mt-10 flex w-full max-w-[380px] flex-col gap-5 rounded-lg border border-glass-border bg-glass p-8 text-left shadow-glass-lg backdrop-blur-lg"
        style={{ animationDelay: ".18s" }}
      >
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="motion-safe:animate-rise mt-6 text-sm text-ink-2" style={{ animationDelay: ".22s" }}>
        Ainda não tem conta?{" "}
        <Link to="/register" className="font-semibold text-accent-bright hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
