import { Server } from "http";

import { connectToDB, sequelize } from "./utils/db/connect";
import httpServerInstance from "./http";
import nodeMediaServerInstance from "./nms";
require("dotenv").config();

class Main {
  private _EXPRESS_PORT: string;
  private _http: Server;
  private _nms: any;

  constructor(http: Server) {
    this._http = http;
    this._nms = nodeMediaServerInstance.nms;
    this._EXPRESS_PORT = process.env.EXPRESS_PORT ?? "";
  }

  public get EXPRESS_PORT(): string {
    return this._EXPRESS_PORT;
  }

  public set EXPRESS_PORT(value: string) {
    this._EXPRESS_PORT = value;
  }

  private serverInit(port: string) {
    this._http.listen(port, () => {
      console.log(`server listening on http://localhost:${port}...`);
    });
  }

  public async main() {
    try {
      console.log("starting server...");
      await connectToDB();
      console.log("sychronizing database tables...");
      await sequelize.sync();
      console.log("tables synchronized.");
      console.log("initializing Express server...");
      console.log("starting Node-Media-Server...");
      this._nms.run();
      this.serverInit(this.EXPRESS_PORT);
    } catch (error) {
      console.log(error);
    }
  }
}

const server = new Main(httpServerInstance.http);
server.main();
