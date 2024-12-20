const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
  const { username, password, color } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      color,
    });
    res
      .status(201)
      .json({ message: "user registered successfully.", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json("an error occurred during registration.");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }

    // const isPasswordValid = password == user.password;
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, color: user.color },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "an error occurred during login." });
  }
};

module.exports = { register, login };
