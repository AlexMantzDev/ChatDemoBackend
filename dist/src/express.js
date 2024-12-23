"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressInstance = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const stream_routes_1 = __importDefault(require("./routes/stream.routes"));
const read_file_1 = __importDefault(require("./utils/yaml/read-file"));
require("dotenv").config();
class ExpressInstance {
    constructor() {
        this._corsConfig = this.loadCorsConfig();
        this._app = (0, express_1.default)();
        this.initialize();
    }
    get app() {
        return this._app;
    }
    set app(value) {
        this._app = value;
    }
    loadCorsConfig() {
        const config = (0, read_file_1.default)();
        if (!config.cors)
            throw new Error("CORS configuration is missing from YAML config.");
        return config.cors;
    }
    initialize() {
        // Middleware
        this._app.use((0, cors_1.default)(this._corsConfig));
        this._app.use(express_1.default.json());
        // Routes
        this._app.use("/api/v1/auth", auth_routes_1.default);
        this._app.use("/api/v1/messages", messages_routes_1.default);
        this._app.use("/stream", stream_routes_1.default);
        // Error handling middleware
        this._app.use(this.errorHandler);
    }
    errorHandler(err, req, res, next) {
        console.error(err.stack);
        res.status(500).json({
            message: "internal server error.",
            error: err.message,
        });
    }
}
exports.ExpressInstance = ExpressInstance;
const expressInstance = new ExpressInstance();
exports.default = expressInstance;
