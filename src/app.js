const express = require("express");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/messages.routes");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: ["http://localhost:4200", "http://192.168.10.103:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("src/html"));
app.use("/api/v1", authRoutes);
app.use("/api/v1", messageRoutes);

module.exports = { app, PORT };
