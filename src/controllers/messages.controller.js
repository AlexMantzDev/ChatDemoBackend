const { ChatMessage, User } = require("../models");

const getAllMessages = async (req, res) => {
  try {
    const data = [];
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
      data.push(populatedMessage);
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to fetch messages." });
  }
};

module.exports = { getAllMessages };
