import { Request, Response, NextFunction } from "express";
import { UserModel } from "../model/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "segredo_super_secreto";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Usuário já cadastrado." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ email, password: hashedPassword });
      await user.save();
      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso." });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Usuário ou senha inválidos." });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Usuário ou senha inválidos." });
      }
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao fazer login." });
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
