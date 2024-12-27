import { Response } from "express";

import { User, ChatMessage, ChatRoom } from "../models/";
import IGetUserAuthInfoRequest from "../interfaces/IGetUserAuthInfoRequest";

export const getAllMessages = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  const { id: userId } = req.user!;

  try {
    const foundMessages = await ChatMessage.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "color"],
        },
        {
          model: ChatRoom,
          include: [
            {
              model: User,
              where: { id: userId },
              attributes: [],
              through: { attributes: [] },
            },
          ],
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    if (!foundMessages || foundMessages.length === 0) {
      res
        .status(404)
        .json({ message: "No messages found for your chat rooms." });
      return;
    }

    res.status(200).json(foundMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};

export const getMessagesByChatRoomId = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  const { chatRoomId } = req.params;
  const { id: userId } = req.user!;
  try {
    const isMember = await ChatRoom.findOne({
      where: { id: chatRoomId },
      include: {
        model: User,
        where: { id: userId },
        attributes: [],
        through: { attributes: [] },
      },
    });
    if (!isMember) {
      res
        .status(403)
        .json({ message: "you are not a member of this chat room." });
      return;
    }
    const foundMessages = await ChatMessage.findAll({
      where: { chatRoomId },
      include: [{ model: User, attributes: ["id", "username", "color"] }],
      order: [["createdAt", "ASC"]],
    });
    if (!foundMessages || foundMessages.length === 0) {
      res
        .status(404)
        .json({ message: "no messages found for this chat room." });
      return;
    }
    res.status(200).json(foundMessages);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error." });
  }
};
