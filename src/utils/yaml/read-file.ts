import { readFileSync } from "fs";
import { parse } from "yaml";

function readYaml() {
  try {
    const data = readFileSync("./config.yaml", "utf8");
    return parse(data);
  } catch (err) {
    console.error("Error:", err);
  }
}

export default readYaml;
