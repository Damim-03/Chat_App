import express from "express"
import {getMe, login, logout, signup} from "../controllers/auth.controller.js";
import protecRoute from "../middleware/protecRoute.js";

const router = express.Router();

router.get("/me", protecRoute ,getMe)

router.post("/login", login)

router.post("/logout", logout)

router.post("/signup", signup)

export default router;