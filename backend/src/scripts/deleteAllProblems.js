import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { ENV } from "../lib/env.js";

const deleteAllProblemsAndSubmissions = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Delete all problems
    const problemsDeleted = await Problem.deleteMany({});
    console.log(`🗑️  Deleted ${problemsDeleted.deletedCount} problems`);

    // Delete all submissions
    const submissionsDeleted = await Submission.deleteMany({});
    console.log(`🗑️  Deleted ${submissionsDeleted.deletedCount} submissions`);

    console.log("\n✨ Successfully cleaned all problems and submissions from database!");
    
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  }
};

deleteAllProblemsAndSubmissions();
