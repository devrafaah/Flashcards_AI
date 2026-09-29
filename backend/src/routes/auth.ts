import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  // Validação básica dos campos
  if (!email || !senha) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  // Verificar se o email já está cadastrado no banco de dados usando Prisma
  const jaExiste = await prisma.user.findUnique({ where: { email } });
  if (jaExiste) {
    res.status(400).json({ error: "Email já cadastrado" });
    return;
  }

  // Hash da senha usando bcrypt e criação do usuário no banco de dados
  const hash = await bcrypt.hash(senha, 12);
  const user = await prisma.user.create({
    data: { email, senha: hash },
  });

  // Gerar um token JWT para o usuário recém-registrado e retornar para o cliente
  const token = jwt.sign(
    { userId: user.id },
    process.env["JWT_SECRET"] ?? "",
    { expiresIn: "7d" }
  );

  // Retornar o token JWT para o cliente
  res.status(201).json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  // Validação básica dos campos de email e senha
  if (!email || !senha) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  // Verificar se o usuário existe no banco de dados usando Prisma
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  // Comparar a senha fornecida com o hash armazenado no banco de dados usando bcrypt
  const senhaCorreta = await bcrypt.compare(senha, user.senha);
  if (!senhaCorreta) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  // Gerar um token JWT para o usuário autenticado e retornar para o cliente
  const token = jwt.sign(
    { userId: user.id },
    process.env["JWT_SECRET"] ?? "",
    { expiresIn: "7d" }
  );

  // Retornar o token JWT para o cliente
  res.json({ token });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  res.json(user);
});

export default router;