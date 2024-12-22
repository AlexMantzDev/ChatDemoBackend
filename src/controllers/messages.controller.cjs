const { ChatMessage, User } = require("../models/index.cjs");

const getAllMessages = async (req, res) => {
  try {
    const messages = [];
    const foundMessage = await ChatMessage.findAll({
      include: { model: User, attributes: ["id", "username", "color"] },
    });
    foundMessage.forEach((e) => {
      populatedMessage = {
        id: e.id,
        User: e.User,
        message: e.message,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
      messages.push(populatedMessage);
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to fetch messages." });
  }
};

module.exports = { getAllMessages };
