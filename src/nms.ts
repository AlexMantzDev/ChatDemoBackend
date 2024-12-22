import { Server } from "http";
import httpServerInstance from "./http.js";

const fs = require("fs");
const NodeMediaServer = require("node-media-server");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment");
const readYaml = require("./utils/yaml/read-file");
require("dotenv").config();

export class NodeMediaServerInstance {
  private _inputURL: string;
  private _nms: typeof NodeMediaServer;
  private _http: Server;

  constructor(http: Server, inputURL: string) {
    this._inputURL = inputURL;
    this._http = http;
    this.checkDirectories();
    this.nmsInit();
    this._nms = new NodeMediaServer(this.loadConfig());
  }

  public get inputURL(): string {
    return this._inputURL;
  }

  public set inputURL(value: string) {
    this._inputURL = value;
  }

  public get nms() {
    return this._nms;
  }

  public set nms(value) {
    this._nms = value;
  }

  public checkDirectories(): void {
    if (!fs.existsSync("/live/")) {
      fs.mkdirSync("/live/");
    }

    if (!fs.existsSync("/videos/")) {
      fs.mkdirSync("/videos/");
    }
  }

  public loadConfig(): any {
    let config = readYaml();
    config = config.nms;
    config.server = this._http;
    if (!config.nms)
      throw new Error("CORS configuration is missing from YAML config.");
    return config;
  }

  public nmsInit(): void {
    this._nms.on("postPublish", (id, streamPath: string, args) => {
      if (streamPath.endsWith("test")) this.saveStream();
    });

    this._nms.on("end", () => {
      this.convertHLSToMP4("/live/", "/videos/");
    });
  }

  public saveStream() {
    const epochTime = moment().format("HH_mm_ss");
    const outputFilename = `${"/live/"}${epochTime}.m3u8`;
    ffmpeg(this._inputURL)
      .inputFormat("flv")
      .outputOptions([
        "-hls_time 25",
        "-hls_list_size 10",
        "-hls_flags delete_segments",
        "-f hls",
      ])
      .output(outputFilename)
      .on("end", () => {
        console.log(`stream saved to ${outputFilename}`);
      })
      .on("error", (err) => {
        console.log("error: ", err);
      })
      .run();
  }

  public convertHLSToMP4(hlsPlaylistPath: string, outputDir: string) {
    const outputFilename = path.join(outputDir, "output.mp4");

    ffmpeg(hlsPlaylistPath)
      .inputOptions(["-y"]) // Overwrite existing files
      .outputOptions([
        "-c copy", // Copy codec to avoid re-encoding
        "-bsf:a aac_adtstoasc", // Convert AAC from ADTS to MPEG format
      ])
      .output(outputFilename)
      .on("start", () => {
        console.log(
          `Starting conversion from ${hlsPlaylistPath} to ${outputFilename}`
        );
      })
      .on("end", () => {
        console.log(`Finished conversion. Output saved to ${outputFilename}`);
      })
      .on("error", (err) => {
        console.error("Error during conversion:", err);
      })
      .run();
  }
}

const nodeMediaServerInstance = new NodeMediaServerInstance(
  httpServerInstance.http,
  "rtmp://127.0.0.1/live/test"
);
export default nodeMediaServerInstance;
