"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = exports.User = exports.sequelize = void 0;
const connect_1 = require("../utils/db/connect");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return connect_1.sequelize; } });
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const ChatMessage_1 = __importDefault(require("./ChatMessage"));
exports.ChatMessage = ChatMessage_1.default;
User_1.default.hasMany(ChatMessage_1.default, { foreignKey: "userId" });
ChatMessage_1.default.belongsTo(User_1.default, { foreignKey: "userId" });
