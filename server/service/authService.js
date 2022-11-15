import jwt from "jsonwebtoken";

export function createToken(user) {
  const expiresIn = "1h";
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn });
}
