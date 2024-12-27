import NodeMediaServer from "node-media-server";
import readYaml from "./utils/yaml/read-file";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import moment from "moment";
import { Server } from "http";
import httpServerInstance from "./http";

class NodeMediaServerInstance {
  private _http: Server;
  private _inputURL: string;
  private _nmsConfig: any;
  private _nms: any;

  constructor(inputURL: string) {
    this._http = httpServerInstance.http;
    this._inputURL = inputURL;
    this._nmsConfig = this.loadNmsConfig();
    this._nms = new NodeMediaServer(this._nmsConfig);
    this.nmsInit();
  }

  public get nms(): any {
    return this._nms;
  }

  private loadNmsConfig() {
    const config = readYaml();
    config.server = this._http;
    if (!config.nms)
      throw new Error("NMS configuration is missing from YAML config.");
    return config.nms;
  }

  public nmsInit(): void {
    console.log("starting Node-Media-Server...");

    this._nms.on("postPublish", (_id: any, streamPath: string, _args: any) => {
      console.log("post publish triggered for stream path: ", streamPath);
      if (streamPath.endsWith("test")) this.saveStream();
    });

    this._nms.on("end", () => {
      this.convertHLSToMP4("./live/", "./videos/");
    });
  }
  public saveStream() {
    const epochTime = moment().format("HH_mm_ss");
    const outputFilename = `${"./live/"}${epochTime}.m3u8`;
    ffmpeg(this._inputURL)
      .setFfmpegPath(ffmpegPath as string)
      .inputFormat("flv")
      .outputOptions([
        "-hls_time 5",
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

  public run() {
    this._nms.run();
  }
}

const nodeMediaServerInstance = new NodeMediaServerInstance(
  "rtmp://127.0.0.1/live/test"
);
export default nodeMediaServerInstance;
