import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Optional,
} from "sequelize";

import sequelizeInstance from "../sequelize";

const sequelize = sequelizeInstance.sequelize;

interface ChatRoomAttributes {
  id: number;
  name: string;
}

interface ChatRoomCreationAttributes
  extends Optional<ChatRoomAttributes, "id"> {}

class ChatRoom extends Model<ChatRoomAttributes, ChatRoomCreationAttributes> {
  public id!: number;
  public name!: string;

  // Association methods (dynamically added by Sequelize)
  public addUser!: (user: number | object) => Promise<void>;
  public addUsers!: (users: number[] | object[]) => Promise<void>;
  public getUsers!: () => Promise<object[]>;
  public removeUser!: (user: number | object) => Promise<void>;
  public removeUsers!: (users: number[] | object[]) => Promise<void>;
}

ChatRoom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ChatRoom",
    tableName: "ChatRooms",
  }
);

export default ChatRoom;
