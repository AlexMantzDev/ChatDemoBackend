import { Response } from "express";

import IGetUserAuthInfoRequest from "../interfaces/IGetUserAuthInfoRequest";
import { User, ChatRoom } from "../models/";

export const getChatRoomsByUserId = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user!;
    if (!user) {
      res.status(401).json({ message: "not authorized." });
      return;
    }
    const chatRooms = await ChatRoom.findAll({
      include: {
        model: User,
        attributes: ["id", "username", "color"],
        through: { attributes: [] },
      },
    });
    if (!chatRooms) {
      res.status(404).json({ message: "no chatrooms found." });
      return;
    }
    res.status(200).json(chatRooms);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "sever error." });
    return;
  }
};

export const getChatRoomById = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  const { chatRoomId } = req.params;
  const { id: userId } = req.user!;
  try {
    const chatRoom = await ChatRoom.findOne({
      where: { id: chatRoomId },
      include: [
        {
          model: User,
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });
    if (!chatRoom) {
      res.status(404).json({ message: "no chatrooms found." });
      return;
    }
    res.status(200).json(chatRoom);
    return;
  } catch (error) {}
};

export const getAllChatRooms = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  const user = req.user!;
  try {
    if (!user) {
      res.status(401).json({ message: "not authorized." });
      return;
    }
    const chatRooms = await ChatRoom.findAll({
      include: {
        model: User,
        through: { attributes: [] },
      },
    });
    if (!chatRooms.length) {
      res.status(404).json({ message: "no chatrooms found." });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error." });
    return;
  }
};

export const createChatRoom = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, members } = req.body;
    if (!name) {
      res.status(400).json({ message: "Chat room name is required." });
      return;
    }

    const chatRoom = await ChatRoom.create({ name });

    if (members && members.length > 0) {
      await chatRoom.addUsers(members);
    }

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const inviteUserToChatRoom = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId, userId } = req.body;
    if (!chatRoomId || !userId) {
      res
        .status(400)
        .json({ message: "Chat room ID and user ID are required." });
      return;
    }

    const chatRoom = await ChatRoom.findByPk(chatRoomId);
    const user = await User.findByPk(userId);

    if (!chatRoom || !user) {
      res.status(404).json({ message: "Chat room or user not found." });
      return;
    }

    await chatRoom.addUser(user);
    res
      .status(200)
      .json({ message: `User ${userId} invited to ChatRoom ${chatRoomId}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const kickUserFromChatRoom = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId, userId } = req.body;
    if (!chatRoomId || !userId) {
      res
        .status(400)
        .json({ message: "Chat room ID and user ID are required." });
      return;
    }

    const chatRoom = await ChatRoom.findByPk(chatRoomId);
    const user = await User.findByPk(userId);

    if (!chatRoom || !user) {
      res.status(404).json({ message: "Chat room or user not found." });
      return;
    }

    await chatRoom.removeUser(user);
    res
      .status(200)
      .json({ message: `User ${userId} removed from ChatRoom ${chatRoomId}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const userLeavesChatRoom = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.body;
    const user = req.user!;

    if (!chatRoomId) {
      res.status(400).json({ message: "Chat room ID is required." });
      return;
    }

    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    if (!chatRoom) {
      res.status(404).json({ message: "Chat room not found." });
      return;
    }

    await chatRoom.removeUser(user.id);

    res
      .status(200)
      .json({ message: `User ${user.id} left chat room ${chatRoomId}.` });
  } catch (error) {
    console.error("Error in userLeavesChatRoom:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteChatRoom = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { chatRoomId } = req.params;

    if (!chatRoomId) {
      res.status(400).json({ message: "Chat room ID is required." });
      return;
    }

    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    if (!chatRoom) {
      res.status(404).json({ message: "Chat room not found." });
      return;
    }

    await chatRoom.destroy();

    res
      .status(200)
      .json({ message: `Chat room ${chatRoomId} deleted successfully.` });
  } catch (error) {
    console.error("Error in deleteChatRoom:", error);
    res.status(500).json({ message: "Server error." });
  }
};
