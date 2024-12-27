import sequelizeInstance from "../sequelize";
import ChatRoom from "./ChatRoom";
import ChatMessage from "./ChatMessage";
import User from "./User";
import ChatRoomUser from "./ChatRoomUser";

const sequelize = sequelizeInstance.sequelize;

ChatRoom.belongsToMany(User, {
  through: ChatRoomUser,
  foreignKey: "chatRoomId",
});

User.belongsToMany(ChatRoom, {
  through: ChatRoomUser,
  foreignKey: "userId",
});

ChatRoom.hasMany(ChatMessage, {
  foreignKey: "chatRoomId",
});

ChatMessage.belongsTo(ChatRoom, {
  foreignKey: "chatRoomId",
});

ChatMessage.belongsTo(User, {
  foreignKey: "senderId",
});

export { sequelize, ChatRoom, ChatMessage, User, ChatRoomUser };
