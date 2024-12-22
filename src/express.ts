import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.cjs";
import messageRoutes from "./routes/messages.routes.cjs";
import readYaml from "./utils/yaml/read-file.cjs";

require("dotenv").config();

export class ExpressInstance {
  private _app: Application;
  private _corsConfig: any;

  constructor() {
    this._corsConfig = this.loadCorsConfig();
    this._app = express();
  }

  public get app(): Application {
    return this._app;
  }

  public set app(value: Application) {
    this._app = value;
  }

  public loadCorsConfig(): any {
    const config = readYaml();
    if (!config.cors)
      throw new Error("CORS configuration is missing from YAML config.");
    return config.cors;
  }

  public initialize(): void {
    // Middleware
    this._app.use(cors(this._corsConfig.cors));
    this._app.use(express.json());

    // Routes
    this._app.use("/api/v1/auth", authRoutes);
    this._app.use("/api/v1/messages", messageRoutes);

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
