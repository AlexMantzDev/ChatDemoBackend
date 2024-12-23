import { createServer, Server } from "http";
import expressInstance from "./express";
import { Application } from "express";

export class HttpServerInstance {
  private _http: Server;
  constructor(express: Application) {
    this._http = createServer(express);
  }

  public get http(): any {
    return this._http;
  }

  public set http(value: Server) {
    this._http = value;
  }
}

const httpServerInstance = new HttpServerInstance(expressInstance.app);
export default httpServerInstance;
