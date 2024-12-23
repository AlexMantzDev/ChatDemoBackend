import { verify, sign } from "jsonwebtoken";
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET ?? "";

interface DecodedToken {
  id: number;
  username: string;
  color: string;
}

export const verifyToken = (token: string): DecodedToken => {
  return verify(token, JWT_SECRET) as DecodedToken;
};

export const generateToken = (payload: DecodedToken) => {
  return sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};
