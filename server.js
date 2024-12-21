const { connectToDB, sequelize } = require("./src/utils/db/connect");
const { server } = require("./src/socket");
const { nms } = require("./src/nms");
require("dotenv").config();

const EXPRESS_PORT = process.env.EXPRESS_PORT;

async function main() {
  console.log("starting server...");
  await connectToDB();
  console.log("sychronizing database tables...");
  await sequelize.sync();
  console.log("tables synchronized.");

  console.log("starting Node-Media-Server...");
  nms.run();
  console.log("initializing Express server...");
  serverInit(EXPRESS_PORT, "0.0.0.0");
}

function serverInit(port, address) {
  server.listen(port, address, () => {
    console.log(`server listening on http://${address}:${port}...`);
  });
}

(async () => {
  await main();
})();
