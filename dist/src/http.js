"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServerInstance = void 0;
const http_1 = require("http");
const express_1 = __importDefault(require("./express"));
class HttpServerInstance {
    constructor(express) {
        this._http = (0, http_1.createServer)(express);
    }
    get http() {
        return this._http;
    }
    set http(value) {
        this._http = value;
    }
}
exports.HttpServerInstance = HttpServerInstance;
const httpServerInstance = new HttpServerInstance(express_1.default.app);
exports.default = httpServerInstance;
