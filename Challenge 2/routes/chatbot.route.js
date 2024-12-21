import express from "express";
import { chatbotInteraction } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/", chatbotInteraction);

export default router;
