import { hash, compare } from "bcrypt";
import { Request, Response } from "express";

import { User } from "../models/";
import { generateToken } from "../utils/jwt/token";
require("dotenv").config();

type Environment = "development" | "production";

const NODE_ENV: Environment =
  (process.env.NODE_ENV as Environment) || "production";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, color } = req.body;
  try {
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      color,
    });
    res
      .status(201)
      .json({ message: "user registered successfully.", user: newUser });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json("an error occurred during registration.");
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ message: "user not found." });
      return;
    }

    let isPasswordValid: boolean = false;
    if (NODE_ENV === "development") {
      isPasswordValid = password == user.password;
    } else if (NODE_ENV === "production") {
      isPasswordValid = await compare(password, user.password);
    }

    if (!isPasswordValid) {
      res.status(401).json({ message: "invalid credentials." });
      return;
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      color: user.color,
    });

    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "an error occurred during login." });
    return;
  }
};
