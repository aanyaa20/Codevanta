import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: mongoose.Schema.Types.Mixed, // Can be array, object, etc.
    required: true,
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const functionParameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const functionSignatureSchema = new mongoose.Schema({
  functionName: {
    type: String,
    required: true,
  },
  returnType: {
    type: String,
    required: true,
  },
  parameters: [functionParameterSchema],
});

const starterCodeSchema = new mongoose.Schema({
  cpp: String,
  c: String,
  python: String,
  javascript: String,
  java: String,
});

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String,
  explanation: String,
});

const problemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    constraints: [String],
    examples: [exampleSchema],
    functionSignature: functionSignatureSchema,
    starterCode: starterCodeSchema,
    testCases: [testCaseSchema],
    tags: [String],
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    totalAccepted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
