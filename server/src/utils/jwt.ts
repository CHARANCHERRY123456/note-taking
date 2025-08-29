import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
}

export function generateToken(payload: JwtPayload, expiresIn = "1d") {
  const secret = process.env.JWT_SECRET as string;
  //@ts-ignore
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, process.env.JWT_SECRET as string) as T;
}
