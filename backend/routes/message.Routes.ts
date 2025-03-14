import express from "express";
import {getMessages, getUsersSidebar, sendMessage} from "../controllers/message.controller.js";
import protecRoute from "../middleware/protecRoute.js";

const router = express.Router();

router.get("/conversations/user", protecRoute, getUsersSidebar)  //get user in sidebar of conversations
router.get("/:id", protecRoute, getMessages)  //get messages
router.post("/send/:id", protecRoute , sendMessage) // send 'POST' messages sender---->Reciver

export default router;
