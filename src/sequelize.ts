import { Sequelize } from "sequelize";

import readYaml from "./utils/yaml/read-file";

class SequelizeInstance {
  private DB_NAME: string;
  private DB_USER: string;
  private DB_PASSWORD: string;
  private _sequelize!: Sequelize;

  constructor() {
    this.DB_NAME = process.env.DB_NAME || "demodatabase";
    this.DB_USER = process.env.DB_USER || "admin";
    this.DB_PASSWORD = process.env.DB_PASSWORD || "password";
    this.initSequelize();
  }

  public get sequelize(): Sequelize {
    return this._sequelize;
  }

  private initSequelize() {
    console.log("initializing database...");
    const config = readYaml();
    if (!config.sequelize) {
      throw new Error("sequelize configuration is missing in the YAML file");
    }
    this._sequelize = new Sequelize(
      this.DB_NAME,
      this.DB_USER,
      this.DB_PASSWORD,
      config.sequelize
    );
  }

  public async connectToDB() {
    console.log("connecting to the database...");
    if (!this._sequelize) {
      throw new Error(
        "sequelize has not been initialized. call initSequelize first."
      );
    }

    try {
      console.log("authenticating...");
      await this._sequelize.authenticate();
      console.log("database connected successfully.");
      return;
    } catch (error) {
      console.error("unable to connect to the database: ", error);
      return;
    }
  }

  public async sync() {
    if (!this._sequelize) {
      throw new Error(
        "sequelize has not been initialized. call initSequelize first."
      );
    }
    console.log("sychronizing database tables...");
    await this._sequelize.sync();
    console.log("tables synchronized.");
    return;
  }
}

const sequelizeInstance = new SequelizeInstance();
export default sequelizeInstance;
