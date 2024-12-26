import express from "express";
import {
  createStreamKey,
  replaceStreamKey,
  verifyStreamKey,
} from "../controllers/users.controller";

const Router = express.Router();

Router.post("/create", createStreamKey);
Router.post("/replace", replaceStreamKey);
Router.post("/verify", verifyStreamKey);

export default Router;
