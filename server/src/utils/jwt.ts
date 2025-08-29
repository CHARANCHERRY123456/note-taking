import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET env is required");
}

export interface JwtPayload {
  id: string;
  email: string;
}

export function generateToken(payload: JwtPayload, expiresIn = "1d") {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, process.env.JWT_SECRET as string) as T;
}
