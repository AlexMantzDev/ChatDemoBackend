import { Request, Response } from "express";
import { ChatMessage, User } from "../models/index";
import IGetUserAuthInfoRequest from "../interfaces/IGetUserAuthInfoRequest";

export const getAllMessages = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const messages: any[] = [];
    const foundMessage = await ChatMessage.findAll({
      include: { model: User, attributes: ["id", "username", "color"] },
    });
    foundMessage.forEach((e: any) => {
      const populatedMessage = {
        id: e.id,
        User: e.User,
        message: e.message,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
      messages.push(populatedMessage);
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to fetch messages." });
  }
};
