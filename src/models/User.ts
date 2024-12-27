import { DataTypes, Model } from "sequelize";
import sequelizeInstance from "../sequelize";

const sequelize = sequelizeInstance.sequelize;

interface UserModel extends Model {
  id: number;
  username: string;
  password: string;
  color: string;
  streamKey: string;
}

const User = sequelize.define<UserModel>("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  streamKey: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

export default User;
