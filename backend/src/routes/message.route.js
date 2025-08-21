import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  updateMessageController,
  deleteMessageController,
} from "../controllers/message.controller.js";

const router = express.Router();


router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

router.put("/:id", protectRoute, updateMessageController);

router.delete("/:id", protectRoute, deleteMessageController);

export default router;
