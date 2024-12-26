import express from "express";
import { getAllMessages } from "../controllers/messages.controller";
import { authenticate } from "../middleware/auth.middleware";

const Router = express.Router();

Router.get("/", authenticate, getAllMessages);

export default Router;
