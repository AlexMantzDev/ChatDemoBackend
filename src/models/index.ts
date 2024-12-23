import { sequelize } from "../utils/db/connect";
import User from "./User";
import ChatMessage from "./ChatMessage";

User.hasMany(ChatMessage, { foreignKey: "userId" });
ChatMessage.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, ChatMessage };
