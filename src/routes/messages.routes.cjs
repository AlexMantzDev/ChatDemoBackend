const express = require("express");
const Router = express.Router();
const { getAllMessages } = require("../controllers/messages.controller");
const { authenticate } = require("../middleware/auth.middleware");

Router.get("/", authenticate, getAllMessages);

module.exports = Router;
