import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../utils/db/connect";

export interface ChatMessageAttributes {
  id: number;
  userId: number;
  message: string;
}

interface ChatMessageCreationAttributes
  extends Optional<ChatMessageAttributes, "id"> {}

class ChatMessage
  extends Model<ChatMessageAttributes, ChatMessageCreationAttributes>
  implements ChatMessageAttributes
{
  public id!: number;
  public userId!: number;
  public message!: string;

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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ChatMessage",
  }
);

export default ChatMessage;
