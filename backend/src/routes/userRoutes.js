import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updatePreferences, getPreferences } from "../controllers/userController.js";

const router = express.Router();

router.get("/preferences", protectRoute, getPreferences);
router.put("/preferences", protectRoute, updatePreferences);

export default router;
