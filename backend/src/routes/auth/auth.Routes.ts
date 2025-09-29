import express from "express"
import {
    signup,
    login,
    logout, getMe,
} from "../../controllers/auth/auth.controller.js";
import { protect } from "../../middleware/protecRoute.js";

const router = express.Router();

router.post("/me", protect, getMe);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);

export default router;