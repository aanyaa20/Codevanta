// Seed script cleared
import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import { ENV } from '../lib/env.js';

const seed250Problems = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log(' Connected to MongoDB');
    console.log('  This seed script has been cleared');
  } catch (error) {
    console.error(' Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed250Problems();
