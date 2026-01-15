// Seed script cleared - ready for new problem seeding logic
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import { ENV } from '../lib/env.js';

const seedProblems = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log(' Connected to MongoDB');

    // Add your new problems here
    const problems = [];

    if (problems.length > 0) {
      await Problem.insertMany(problems);
      console.log(' Successfully seeded problems');
    } else {
      console.log('  No problems to seed');
    }
  } catch (error) {
    console.error(' Error seeding problems:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedProblems();
