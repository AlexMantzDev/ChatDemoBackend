const bcrypt = require("bcrypt");
const { User } = require("../src/models");

async function createDummyUsers() {
  try {
    const users = [
      { username: "Alex", password: "123123", color: "#ff0000" },
      { username: "Becky", password: "234234", color: "#00ff00" },
      { username: "Charlie", password: "345345", color: "#0000ff" },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        username: user.username,
        password: hashedPassword,
        color: user.color,
      });

      console.log(`created user: ${user.username}`);
    }
    console.log("dummy users created successfully.");
  } catch (error) {
    console.error("error creating dummy users: ", error);
  }
}

createDummyUsers();
