"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_media_server_1 = __importDefault(require("node-media-server"));
const read_file_1 = __importDefault(require("./utils/yaml/read-file"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const http_1 = __importDefault(require("./http"));
class NodeMediaServerInstance {
    constructor(http, inputURL) {
        this._http = http;
        this._inputURL = inputURL;
        this._nmsConfig = this.loadNmsConfig();
        this._nms = new node_media_server_1.default(this._nmsConfig);
        this.nmsInit();
    }
    get nms() {
        return this._nms;
    }
    set nms(value) {
        this._nms = value;
    }
    loadNmsConfig() {
        const config = (0, read_file_1.default)();
        config.server = this._http;
        if (!config.nms)
            throw new Error("NMS configuration is missing from YAML config.");
        return config.nms;
    }
    nmsInit() {
        this._nms.on("postPublish", (_id, streamPath, _args) => {
            console.log("post publish triggered for stream path: ", streamPath);
            if (streamPath.endsWith("test"))
                this.saveStream();
        });
        this._nms.on("end", () => {
            this.convertHLSToMP4("/live/", "/videos/");
        });
    }
    saveStream() {
        const epochTime = (0, moment_1.default)().format("HH_mm_ss");
        const outputFilename = `${"/live/"}${epochTime}.m3u8`;
        (0, fluent_ffmpeg_1.default)(this._inputURL)
            .setFfmpegPath(ffmpeg_static_1.default)
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
    convertHLSToMP4(hlsPlaylistPath, outputDir) {
        const outputFilename = path_1.default.join(outputDir, "output.mp4");
        (0, fluent_ffmpeg_1.default)(hlsPlaylistPath)
            .inputOptions(["-y"]) // Overwrite existing files
            .outputOptions([
            "-c copy", // Copy codec to avoid re-encoding
            "-bsf:a aac_adtstoasc", // Convert AAC from ADTS to MPEG format
        ])
            .output(outputFilename)
            .on("start", () => {
            console.log(`Starting conversion from ${hlsPlaylistPath} to ${outputFilename}`);
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
const nodeMediaServerInstance = new NodeMediaServerInstance(http_1.default.http, "rtmp://127.0.0.1/live/test");
exports.default = nodeMediaServerInstance;
