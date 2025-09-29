import express from "express"

import {protect} from "../../middleware/protecRoute.js";
import {getUsersForSidebar} from "../../controllers/user/user.controller.js";


const router = express.Router();

router.get("/", protect, getUsersForSidebar);


export default router;