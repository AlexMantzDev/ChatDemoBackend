import { connectToDB, sequelize } from "./utils/db/connect.js";
import { Server } from "http";
import os from "os";

import httpServerInstance from "./http.js";
import nodeMediaServerInstance from "./nms.js";
require("dotenv").config();

class Main {
  private _EXPRESS_PORT: string;
  private _http: Server;
  private _nms;

  constructor(http, nms) {
    this._http = http;
    this._nms = nms;
    this.EXPRESS_PORT = process.env.EXPRESS_PORT;
  }

  public get EXPRESS_PORT(): string {
    return this._EXPRESS_PORT;
  }

  public set EXPRESS_PORT(value: string) {
    this._EXPRESS_PORT = value;
  }

  private serverInit(port, address) {
    this._http.listen(port, address, () => {
      console.log(`server listening on http://${address}:${port}...`);
    });
  }

  private getLocalIPAddress() {
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          // Skip internal (127.0.0.1) and non-IPv4 addresses
          if (iface.family === "IPv4" && !iface.internal) {
            return iface.address;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async main() {
    try {
      console.log("starting server...");
      await connectToDB();
      console.log("sychronizing database tables...");
      await sequelize.sync();
      console.log("tables synchronized.");

      console.log("starting Node-Media-Server...");
      this._nms.run();
      console.log("initializing Express server...");
      this.serverInit(this.EXPRESS_PORT, this.getLocalIPAddress());
    } catch (error) {
      console.log(error);
    }
  }
}

const server = new Main(httpServerInstance.http, nodeMediaServerInstance.nms);
server.main();
