const { sequelize } = require("../utils/db/connect");
const User = require("./User");
const ChatMessage = require("./ChatMessage");

User.hasMany(ChatMessage, { foreignKey: "userId" });
ChatMessage.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  ChatMessage,
};
