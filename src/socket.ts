import { Server as SocketServer } from "socket.io";
import { Server } from "http";

import httpServerInstance from "./http.js";
import { User, ChatMessage } from "./models/index.cjs";
import readYaml from "./utils/yaml/read-file.cjs";

export class SocketIoInstance {
  private _io: SocketServer;

  constructor(http: Server) {
    this._io = new SocketServer(http, this.loadConfig());
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

      socket.on("sendMessage", async (data) => {
        console.log("message received");
        const { userId, message } = data;
        const newMessage = await ChatMessage.create({ userId, message });
        const options = {
          include: { model: User, attributes: ["id", "username", "color"] },
        };
        const foundMessage = await ChatMessage.findByPk(newMessage.id, options);
        const cleanMessage = this.messageCleaner(foundMessage);
        this._io.emit("newMessage", cleanMessage);
      });

      socket.on("disconnect", () => {
        console.log("a user disconnected: ", socket.id);
      });
    });
  }

  private messageCleaner(rawMessage) {
    return {
      id: rawMessage.id,
      User: rawMessage.User,
      message: rawMessage.message,
      createdAt: rawMessage.createdAt,
      updatedAt: rawMessage.updatedAt,
    };
  }
}

const socketIoInstance = new SocketIoInstance(httpServerInstance.http);
export default socketIoInstance;
