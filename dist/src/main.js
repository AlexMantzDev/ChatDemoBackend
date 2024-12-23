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
const connect_1 = require("./utils/db/connect");
const http_1 = __importDefault(require("./http"));
const nms_1 = __importDefault(require("./nms"));
require("dotenv").config();
class Main {
    constructor(http) {
        var _a;
        this._http = http;
        this._nms = nms_1.default.nms;
        this._EXPRESS_PORT = (_a = process.env.EXPRESS_PORT) !== null && _a !== void 0 ? _a : "";
    }
    get EXPRESS_PORT() {
        return this._EXPRESS_PORT;
    }
    set EXPRESS_PORT(value) {
        this._EXPRESS_PORT = value;
    }
    serverInit(port) {
        this._http.listen(port, () => {
            console.log(`server listening on http://localhost:${port}...`);
        });
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("starting server...");
                yield (0, connect_1.connectToDB)();
                console.log("sychronizing database tables...");
                yield connect_1.sequelize.sync();
                console.log("tables synchronized.");
                console.log("initializing Express server...");
                console.log("starting Node-Media-Server...");
                this._nms.run();
                this.serverInit(this.EXPRESS_PORT);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const server = new Main(http_1.default.http);
server.main();
