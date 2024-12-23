"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const liveStreamPath = "/live";
const videoPath = "/vidoes";
// if (!fs.existsSync(liveStreamPath)) fs.mkdirSync(liveStreamPath);
// if (!fs.existsSync(videoPath)) fs.mkdirSync(videoPath);
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
const stream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const streamKey = req.query.streamKey;
        if (!streamKey) {
            res.status(400).send("missing stream key.");
            return;
        }
        const outputHLSPath = path_1.default.join(liveStreamPath, `${streamKey}.m3u8`);
        (0, fluent_ffmpeg_1.default)(`rtmp://127.0.0.1/live/${streamKey}`)
            .outputOptions([
            "-c:v libx264",
            "-preset veryfast",
            "-b:v 1500k",
            "-maxrate 1500k",
            "-bufsize 3000k",
            "-g 60",
            "-hls_time 4",
            "-hls_playlist_type event",
        ])
            .output(outputHLSPath)
            .on("start", (commandLine) => {
            console.log(`Spawned FFmpeg with command: ${commandLine}`);
        })
            .on("end", () => {
            console.log(`HLS stream saved to ${outputHLSPath}`);
        })
            .on("error", (err) => {
            console.error("Error during processing:", err);
        })
            .run();
        res.status(200).send(`HLS stream started on for streamKey ${streamKey}`);
    }
    catch (error) {
        console.error("Error processing stream:", error);
        res.status(500).send("Error processing stream.");
    }
});
exports.stream = stream;
