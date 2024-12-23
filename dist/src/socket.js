"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoInstance = void 0;
const socket_io_1 = require("socket.io");
const http_js_1 = __importDefault(require("./http.js"));
const index_1 = require("./models/index");
const read_file_1 = __importDefault(require("./utils/yaml/read-file"));
class SocketIoInstance {
    constructor(http) {
        this._io = new socket_io_1.Server(http, this.loadConfig());
    }
    loadConfig() {
        const config = (0, read_file_1.default)();
        if (!config.cors)
            throw new Error("CORS configuration is missing from YAML config.");
        return config.cors;
    }
    ioInit() {
        this._io.on("connection", (socket) => {
            console.log("user connected.");
            socket.on("sendMessage", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log("message received");
                const { userId, message } = data;
                const newMessage = yield index_1.ChatMessage.create({ userId, message });
                const options = {
                    include: { model: index_1.User, attributes: ["id", "username", "color"] },
                };
                const foundMessage = yield index_1.ChatMessage.findByPk(newMessage.id, options);
                if (!foundMessage)
                    return;
                const cleanMessage = this.messageCleaner(foundMessage);
                this._io.emit("newMessage", cleanMessage);
            }));
            socket.on("disconnect", () => {
                console.log("a user disconnected: ", socket.id);
            });
        });
    }
    messageCleaner(rawMessage) {
        return {
            id: rawMessage.id,
            User: rawMessage.user,
            message: rawMessage.message,
            createdAt: rawMessage.createdAt,
            updatedAt: rawMessage.updatedAt,
        };
    }
}
exports.SocketIoInstance = SocketIoInstance;
const socketIoInstance = new SocketIoInstance(http_js_1.default.http);
exports.default = socketIoInstance;
