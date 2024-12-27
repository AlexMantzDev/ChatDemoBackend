import { DataTypes, Model, Optional } from "sequelize";
import sequelizeInstance from "../sequelize";
import ChatRoom from "./ChatRoom";
import User from "./User";

const sequelize = sequelizeInstance.sequelize;

interface ChatRoomUserAttributes {
  chatRoomId: number;
  userId: number;
}

class ChatRoomUser extends Model<ChatRoomUserAttributes> {
  public chatRoomId!: number;
  public userId!: number;
}

ChatRoomUser.init(
  {
    chatRoomId: {
      type: DataTypes.INTEGER,
      references: {
        model: ChatRoom,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "ChatRoomUser",
    tableName: "ChatRoomUsers",
    timestamps: false,
  }
);

export default ChatRoomUser;
