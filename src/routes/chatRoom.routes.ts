import express from "express";
import {
  getAllChatRooms,
  getChatRoomById,
  getChatRoomsByUserId,
} from "../controllers/chat-room.controller";

import {
  getAllMessages,
  getMessagesByChatRoomId,
} from "../controllers/chat-messages.controller";
import { authenticate } from "../middleware/auth.middleware";

const Router = express.Router();

Router.get("/", authenticate, getChatRoomsByUserId);
Router.get("/messages", authenticate, getAllMessages);
Router.get("/:chatRoomId", authenticate, getChatRoomById);
Router.get("/:chatRoomId/messages", authenticate, getMessagesByChatRoomId);

export default Router;
