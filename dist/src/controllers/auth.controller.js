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
exports.login = exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const User_1 = __importDefault(require("../models/User"));
const token_1 = require("../utils/jwt/token");
require("dotenv").config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, color } = req.body;
    try {
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newUser = yield User_1.default.create({
            username,
            password: hashedPassword,
            color,
        });
        res
            .status(201)
            .json({ message: "user registered successfully.", user: newUser });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(400).json("an error occurred during registration.");
        return;
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ where: { username } });
        if (!user) {
            res.status(404).json({ message: "user not found." });
            return;
        }
        const isPasswordValid = (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "invalid credentials." });
            return;
        }
        const token = (0, token_1.generateToken)({
            id: user.id,
            username: user.username,
            color: user.color,
        });
        res.status(200).json({ token });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: "an error occurred during login." });
        return;
    }
});
exports.login = login;
