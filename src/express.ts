import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import messagesRoutes from "./routes/messages.routes";
import readYaml from "./utils/yaml/read-file";

require("dotenv").config();

export class ExpressInstance {
  private _app: Application;
  private _corsConfig: any;

  constructor() {
    this._corsConfig = this.loadCorsConfig();
    this._app = express();
    this.initialize();
  }

  public get app(): Application {
    return this._app;
  }

  public set app(value: Application) {
    this._app = value;
  }

  private loadCorsConfig(): any {
    const config = readYaml();
    if (!config.cors)
      throw new Error("CORS configuration is missing from YAML config.");
    return config.cors;
  }

  public initialize(): void {
    // Middleware
    this._app.use(cors(this._corsConfig));
    this._app.use(express.json());

    // Routes
    this._app.use("/api/v1/auth", authRoutes);
    this._app.use("/api/v1/messages", messagesRoutes);
    // Error handling middleware
    this._app.use(this.errorHandler);
  }

  private errorHandler(
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    console.error(err.stack);
    res.status(500).json({
      message: "internal server error.",
      error: err.message,
    });
  }
}

const expressInstance = new ExpressInstance();
export default expressInstance;
