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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = void 0;
const index_1 = require("../models/index");
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = [];
        const foundMessage = yield index_1.ChatMessage.findAll({
            include: { model: index_1.User, attributes: ["id", "username", "color"] },
        });
        foundMessage.forEach((e) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "failed to fetch messages." });
    }
});
exports.getAllMessages = getAllMessages;
