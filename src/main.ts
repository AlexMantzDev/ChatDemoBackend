import { Server } from "http";

import sequelizeInstance from "./sequelize";
import httpServerInstance from "./http";
import nodeMediaServerInstance from "./nms";
require("dotenv").config();

class Main {
  private _EXPRESS_PORT: string;

  constructor() {
    this._EXPRESS_PORT = process.env.EXPRESS_PORT || "3000";
  }

  private serverInit(port: string) {
    httpServerInstance.http.listen(port, () => {
      console.log(`server listening on http://localhost:${port}...`);
    });
  }

  public async main() {
    try {
      console.log("starting server...");
      await sequelizeInstance.connectToDB();
      await sequelizeInstance.sync();
      nodeMediaServerInstance.run();
      this.serverInit(this._EXPRESS_PORT);
    } catch (error) {
      console.log(error);
    }
  }
}

const server = new Main();
server.main();
