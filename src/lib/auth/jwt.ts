// src/lib/auth/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_RUMPI_DEV_ONLY";

type JwtPayload = {
  userId: string;
  email: string;
};

// generate token
export function signAuthToken(payload: JwtPayload, expiresIn = "1d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// verify token: return payload atau null
export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
