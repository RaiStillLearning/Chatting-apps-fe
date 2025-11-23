import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "SUPER_SECRET_RUMPI_DEV_ONLY";

// generate token
export function signAuthToken(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "1d"
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions);
}

// verify token
export function verifyAuthToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
