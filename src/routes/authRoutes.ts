import express from "express";
import { signup, login, updateProfile, getProfile } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile); 
router.put("/profile", authMiddleware, updateProfile);

export default router;