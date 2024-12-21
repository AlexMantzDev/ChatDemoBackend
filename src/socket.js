const { app } = require("./app");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { User, ChatMessage } = require("./models/index");
const readYaml = require("./utils/yaml/read-file");
const config = readYaml();

const server = createServer(app);
const io = new Server(server, config.cors);

io.on("connection", (socket) => {
  console.log("user connected.");
  socket.on("sendMessage", async (data) => {
    console.log("message received");
    const { userId, message } = data;
    const newMessage = await ChatMessage.create({ userId, message });
    const options = {
      include: { model: User, attributes: ["id", "username", "color"] },
    };
    const foundMessage = await ChatMessage.findByPk(newMessage.id, options);
    const cleanMessage = messageCleaner(foundMessage);
    io.emit("newMessage", cleanMessage);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
  });
});

function messageCleaner(rawMessage) {
  return {
    id: rawMessage.id,
    User: rawMessage.User,
    message: rawMessage.message,
    createdAt: rawMessage.createdAt,
    updatedAt: rawMessage.updatedAt,
  };
}

module.exports = { io, server };
