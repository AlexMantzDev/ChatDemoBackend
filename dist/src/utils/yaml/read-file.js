"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yaml_1 = require("yaml");
function readYaml() {
    try {
        const data = (0, fs_1.readFileSync)("./config.yaml", "utf8");
        return (0, yaml_1.parse)(data);
    }
    catch (err) {
        console.error("Error:", err);
    }
}
exports.default = readYaml;
