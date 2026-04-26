import express from "express";
import { getTranscript, saveNote, getHistory } from "../controllers/transcriptController.js";
import authMiddleware from "../middleware/authMiddleware.js";

console.log("🔥 transcript route loaded");

const router = express.Router();

router.post("/generate", getTranscript);
router.post("/save", authMiddleware, saveNote);
router.get("/history", authMiddleware, getHistory);

export default router;