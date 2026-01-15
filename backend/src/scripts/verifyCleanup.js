import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { ENV } from "../lib/env.js";

const verifyCleanup = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB\n");

    // Count problems
    const problemCount = await Problem.countDocuments({});
    console.log(`📊 Problems in database: ${problemCount}`);

    // Count submissions
    const submissionCount = await Submission.countDocuments({});
    console.log(`📊 Submissions in database: ${submissionCount}`);

    console.log("\n" + "=".repeat(50));
    if (problemCount === 0 && submissionCount === 0) {
      console.log("✨ SUCCESS! Database is completely clean!");
    } else {
      console.log("⚠️  Warning: Some data still exists");
    }
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("❌ Error verifying cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
};

verifyCleanup();
