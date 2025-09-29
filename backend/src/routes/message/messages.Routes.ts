import express from "express";
import { getUsersForSidebar, getMessages, sendMessage } from "../../controllers/message/messages.controller.js";
import { protect } from "../../middleware/protecRoute.js";

const router = express.Router();

router.get("/conversations", protect, getUsersForSidebar);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);

export default router;
