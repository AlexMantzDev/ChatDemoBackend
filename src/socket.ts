import { Server as SocketServer } from "socket.io";

import httpServerInstance from "./http";
import readYaml from "./utils/yaml/read-file";
import { ChatMessage, User, ChatRoomUser } from "./models/";

export class SocketIoInstance {
  private _io: SocketServer;

  constructor() {
    this._io = new SocketServer(httpServerInstance.http, this.loadConfig());
  }

  public loadConfig(): any {
    const config = readYaml();
    if (!config.cors)
      throw new Error("CORS configuration is missing from YAML config.");
    return config.cors;
  }

  public ioInit() {
    this._io.on("connection", (socket) => {
      console.log("user connected.");

      // Handle user joining a chat room
      socket.on("joinRoom", async ({ userId, chatRoomId }) => {
        console.log(`user ${userId} attempting to join room ${chatRoomId}`);

        const isMember = await ChatRoomUser.findOne({
          where: { userId, chatRoomId },
        });

        if (!isMember) {
          console.error(`user ${userId} is not a member of room ${chatRoomId}`);
          socket.emit("error", {
            message: "you are not a member of this room.",
          });
          return;
        }

        socket.join(`room_${chatRoomId}`);
        socket.emit("joinedRoom", { chatRoomId });
        console.log(`user ${userId} joined the room ${chatRoomId}`);
      });

      // Handle sending a message
      socket.on("sendMessage", async ({ userId, chatRoomId, message }) => {
        console.log(`message received in room ${chatRoomId}: ${message}`);

        const isMember = await ChatRoomUser.findOne({
          where: { userId, chatRoomId },
        });

        if (!isMember) {
          console.error(`user ${userId} is not a member of room ${chatRoomId}`);
          socket.emit("error", {
            message: "you are not a member of this room.",
          });
          return;
        }

        const newMessage = await ChatMessage.create({
          chatRoomId,
          senderId: userId,
          content: message,
        });

        const options = {
          include: { model: User, attributes: ["id", "username", "color"] },
        };

        const foundMessage = await ChatMessage.findByPk(newMessage.id, options);

        if (!foundMessage) return;

        this._io.to(`room_${chatRoomId}`).emit("newMessage", foundMessage);
      });

      // Handle user leaving chat room
      socket.on("leaveRoom", ({ chatRoomId }) => {
        socket.leave(`room_${chatRoomId}`);
        console.log(`user ${socket.id} left room ${chatRoomId}`);
      });

      // Handle user diconnection
      socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.id}`);
      });
    });
  }
}

const socketIoInstance = new SocketIoInstance();
export default socketIoInstance;
