const fs = require("fs");
const yaml = require("yaml");

function readYaml() {
  try {
    const data = fs.readFileSync("./config.yaml", "utf8");
    return yaml.parse(data);
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = readYaml;
