import { DataTypes, Model, Optional } from "sequelize";
import sequelizeInstance from "../sequelize";
import ChatRoom from "./ChatRoom";

const sequelize = sequelizeInstance.sequelize;

interface ChatMessageAttributes {
  id: number;
  chatRoomId: number;
  senderId: number;
  content: string;
}

interface ChatMessageCreationAttributes
  extends Optional<ChatMessageAttributes, "id"> {}

class ChatMessage
  extends Model<ChatMessageAttributes, ChatMessageCreationAttributes>
  implements ChatMessageAttributes
{
  public id!: number;
  public chatRoomId!: number;
  public senderId!: number;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatRoom,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ChatMessage",
    tableName: "ChatMessages",
  }
);

export default ChatMessage;
