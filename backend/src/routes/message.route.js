import express from "express"
import { protectRoute } from "../middleware/auth.middlewate";
import { getMessages, getUserForSideBar } from "../controllers/message.controller";

const router = express.Router();

router.get("/user", protectRoute, getUserForSideBar);
router.get(":id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage)
export default router;