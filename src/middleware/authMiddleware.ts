import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";



export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
