"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
const verifyToken = (token) => {
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const generateToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
