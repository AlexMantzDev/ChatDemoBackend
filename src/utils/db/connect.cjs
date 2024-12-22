const { Sequelize } = require("sequelize");
const readYaml = require("../yaml/read-file.cjs");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

let sequelize;

function initSequelize() {
  console.log("initializing database...");
  const config = readYaml();
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, config.sequelize);
}

initSequelize();

async function connectToDB() {
  console.log("connecting to the database...");
  try {
    console.log("authenticating...");
    await sequelize.authenticate();
    console.log("database connected successfully.");
  } catch (error) {
    console.error("unable to connect to the database: ", error);
  }
}

module.exports = { connectToDB, sequelize };
