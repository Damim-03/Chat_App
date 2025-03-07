import express from "express";
import {conversations} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/conversation", conversations)

export default router;
