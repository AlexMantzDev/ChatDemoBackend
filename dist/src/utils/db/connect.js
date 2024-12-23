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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectToDB = connectToDB;
const sequelize_1 = require("sequelize");
const read_file_1 = __importDefault(require("../yaml/read-file"));
require("dotenv").config();
const DB_NAME = (_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : "";
const DB_USER = (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : "";
const DB_PASSWORD = (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : "";
function initSequelize() {
    console.log("initializing database...");
    const config = (0, read_file_1.default)();
    exports.sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, config.sequelize);
}
initSequelize();
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("connecting to the database...");
        try {
            console.log("authenticating...");
            yield exports.sequelize.authenticate();
            console.log("database connected successfully.");
        }
        catch (error) {
            console.error("unable to connect to the database: ", error);
        }
    });
}
