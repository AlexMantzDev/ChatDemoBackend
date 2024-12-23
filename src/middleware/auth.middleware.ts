import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt/token";
import IGetUserAuthInfoRequest from "../interfaces/IGetUserAuthInfoRequest";

export const authenticate = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Auth token failure." });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied. Invalid token." });
    return;
  }
};
