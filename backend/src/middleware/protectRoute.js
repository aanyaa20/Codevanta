import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Use getAuth instead of requireAuth to avoid redirects on API routes
    const auth = getAuth(req);
    const clerkId = auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - no valid session" });
    }

    // find user in db by clerk ID
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Optional auth middleware - attaches user if authenticated but doesn't require it
export const optionalAuth = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const clerkId = auth?.userId;

    if (clerkId) {
      const user = await User.findOne({ clerkId });
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without user if auth fails
    next();
  }
};