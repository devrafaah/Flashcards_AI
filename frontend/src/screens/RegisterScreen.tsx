import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";
import { Eyebrow } from "../components/Eyebrow";
import { TextField } from "../components/TextField";
import { Button } from "../components/Button";
import { Icon } from "../components/icons";

export function RegisterScreen() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await registrar(email, senha);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta. Tente novamente.");
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
        Crie sua conta.
      </h1>
      <p className="motion-safe:animate-rise mt-3 max-w-[40ch] text-ink-2" style={{ animationDelay: ".12s" }}>
        Transforme PDFs em flashcards prontos para estudar.
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
          autoComplete="new-password"
          required
          minLength={6}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
          {loading ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <p className="motion-safe:animate-rise mt-6 text-sm text-ink-2" style={{ animationDelay: ".22s" }}>
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-accent-bright hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
