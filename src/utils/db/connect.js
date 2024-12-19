const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("demodatabase", "admin", "password", {
  host: "localhost",
  dialect: "postgres",
});

async function connectToDB() {
  try {
    await sequelize.authenticate();
    console.log("connection has been established successfully.");
  } catch (error) {
    console.error("unable to connect to the database: ", error);
  }
}

module.exports = { connectToDB, sequelize };
