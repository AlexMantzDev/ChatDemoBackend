import express from "express";
import { getAllMessages } from "../controllers/messages.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getAllMessages);

export default router;
