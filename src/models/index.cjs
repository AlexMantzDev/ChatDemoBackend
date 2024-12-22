const { sequelize } = require("../utils/db/connect");
const User = require("./User.cjs");
const ChatMessage = require("./ChatMessage.cjs");

User.hasMany(ChatMessage, { foreignKey: "userId" });
ChatMessage.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  ChatMessage,
};
