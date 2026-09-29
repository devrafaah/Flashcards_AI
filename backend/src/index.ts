import "dotenv/config";
import express from "express";
import cors from "cors";
import { MulterError } from "multer";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/decks";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/decks", deckRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(
  (err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);

    if (err instanceof MulterError || err instanceof Error) {
      const isValidationError =
        err instanceof MulterError || err.message === "Apenas arquivos PDF são aceitos";

      res
        .status(isValidationError ? 400 : 500)
        .json({ error: err.message || "Erro interno do servidor" });
      return;
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
);

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});