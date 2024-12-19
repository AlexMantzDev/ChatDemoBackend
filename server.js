const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { app } = require("./src/app");
const { connectToDB, sequelize } = require("./src/utils/db/connect");
const ChatMessage = require("./src/models/ChatMessage");
const User = require("./src/models/User");
require("dotenv").config();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200", "http://192.168.10.103:4200"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

connectToDB();

io.on("connection", (socket) => {
  console.log("user connected.");

  socket.on("sendMessage", async (data) => {
    console.log("message received");
    const { userId, message } = data;
    const newMessage = await ChatMessage.create({ userId, message });
    const foundMessage = await ChatMessage.findByPk(newMessage.id, {
      include: { model: User, attributes: ["id", "username", "color"] },
    });
    populatedMessage = {
      id: foundMessage.id,
      User: foundMessage.User,
      message: foundMessage.message,
      createdAt: foundMessage.createdAt,
      updatedAt: foundMessage.updatedAt,
    };

    io.emit("newMessage", populatedMessage);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
  });
});

const address = "0.0.0.0";

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, address, () => {
    console.log(`server listening on http://${address}:${PORT}...`);
  });
});
