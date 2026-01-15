import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMyRecordings,
  getRecordingById,
  startRecording,
  stopRecording,
  refreshRecording,
  deleteRecording,
  recordingWebhook,
} from "../controllers/recordingController.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/", protectRoute, getMyRecordings);
router.get("/:id", protectRoute, getRecordingById);
router.post("/start", protectRoute, startRecording);
router.post("/stop", protectRoute, stopRecording);
router.post("/:id/refresh", protectRoute, refreshRecording);
router.delete("/:id", protectRoute, deleteRecording);

// Webhook from Stream (no auth needed)
router.post("/webhook", recordingWebhook);

export default router;
