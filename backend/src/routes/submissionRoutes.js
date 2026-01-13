import express from "express";
import { getRecentSubmissions } from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/recent", protectRoute, getRecentSubmissions);

export default router;
