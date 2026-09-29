import { Router, Response, NextFunction } from "express";
import multer from "multer";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { extrairTextoPDF } from "../services/pdf.service";
import { gerarFlashcards } from "../services/flashcard.service";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Apenas arquivos PDF são aceitos"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/",
  authMiddleware,
  upload.single("arquivo"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
      }

      const titulo: string =
        req.body.titulo || req.file.originalname.replace(/\.pdf$/i, "");

      const textoExtraido = await extrairTextoPDF(req.file.buffer);
      const { cards } = await gerarFlashcards(textoExtraido, titulo);

      const deck = await prisma.deck.create({
        data: {
          titulo,
          arquivo: req.file.originalname,
          userId: req.userId!,
          cards: {
            create: cards.map((card) => ({
              pergunta: card.pergunta,
              resposta: card.resposta,
              pagina: card.pagina,
              dificuldade: card.dificuldade,
            })),
          },
        },
        include: { cards: true },
      });

      res.status(201).json(deck);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const decks = await prisma.deck.findMany({
        where: { userId: req.userId! },
        select: {
          id: true,
          titulo: true,
          arquivo: true,
          createdAt: true,
          _count: { select: { cards: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json(decks);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const deck = await prisma.deck.findUnique({
        where: { id: String(req.params.id) },
        include: { cards: true },
      });

      if (!deck || deck.userId !== req.userId) {
        res.status(404).json({ error: "Deck não encontrado" });
        return;
      }

      res.json(deck);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
