import express from "express";
import { getTranscript } from "../controllers/transcriptController.js";

console.log("🔥 transcript route loaded");

const router = express.Router();

router.post("/generate", getTranscript);

export default router;