const fs = require("fs");
const NodeMediaServer = require("node-media-server");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment");
const readYaml = require("./utils/yaml/read-file");
const config = readYaml();
const nms = new NodeMediaServer(config.nms);
const inputURL = "rtmp://127.0.0.1/live/test";
require("dotenv").config();

const LIVE_DIR = process.env.LIVE_DIR;
const MP4_DIR = process.env.MP4_DIR;

if (!fs.existsSync(LIVE_DIR)) {
  fs.mkdirSync(LIVE_DIR);
}
if (!fs.existsSync(MP4_DIR)) {
  fs.mkdirSync(MP4_DIR);
}

function saveStream() {
  const epochTime = moment().format("HH_mm_ss");
  const outputFilename = `${LIVE_DIR}${epochTime}.m3u8`;
  ffmpeg(inputURL)
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

function convertHLSToMP4(hlsPlaylistPath, outputDir) {
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

convertHLSToMP4("./hls_playlist/19_02_34.m3u8", MP4_DIR);

nms.on("postPublish", (id, streamPath, args) => {
  if (streamPath.endsWith("test")) saveStream();
});

nms.on("end", () => {
  convertHLSToMP4("./hls_playlist/");
});

module.exports = { nms };
