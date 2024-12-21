const express = require("express");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/messages.routes");
const cors = require("cors");
const readYaml = require("./utils/yaml/read-file");
const config = readYaml();
require("dotenv").config();

const app = express();

app.use(cors(config.cors));
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", messageRoutes);

module.exports = { app };
