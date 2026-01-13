import express from "express";
import {
  getProblems,
  getProblemBySlug,
  runCode,
  submitCode,
  getUserSubmissions,
  getRecentSubmissions,
} from "../controllers/problemController.js";
import { protectRoute, optionalAuth } from "../middleware/protectRoute.js";

const router = express.Router();

// Public routes
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

// Routes that work with or without auth
router.post("/:slug/run", optionalAuth, runCode);
router.post("/:slug/submit", optionalAuth, submitCode);

// Protected routes
router.get("/:slug/submissions", protectRoute, getUserSubmissions);

export default router;
