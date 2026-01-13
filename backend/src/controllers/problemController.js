import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { executeWithWrapper } from "../lib/codeExecutor.js";

/**
 * GET /api/problems
 * Get list of all problems (metadata only)
 */
export const getProblems = async (req, res) => {
  try {
    const { difficulty, tags, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const skip = (page - 1) * limit;

    const problems = await Problem.find(filter)
      .select("slug title difficulty tags acceptanceRate totalSubmissions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      problems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getProblems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
};

/**
 * GET /api/problems/:slug
 * Get full problem details by slug
 */
export const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Don't send hidden test cases to frontend
    const problemData = problem.toObject();
    problemData.testCases = problemData.testCases
      .filter((tc) => !tc.hidden)
      .map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }));

    res.json({
      success: true,
      problem: problemData,
    });
  } catch (error) {
    console.error("Error in getProblemBySlug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch problem",
    });
  }
};

/**
 * POST /api/problems/:slug/run
 * Run code against visible test cases only (REAL ONLINE JUDGE)
 */
export const runCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required",
      });
    }

    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Validate function signature exists
    if (!problem.functionSignature) {
      return res.status(500).json({
        success: false,
        message: "Problem configuration error: missing function signature",
      });
    }

    // Only run visible test cases
    const visibleTestCases = problem.testCases.filter((tc) => !tc.hidden);

    if (visibleTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No test cases available",
      });
    }

    // Execute with wrapper (user writes ONLY the function)
    const result = await executeWithWrapper(
      language,
      code,
      problem.functionSignature,
      visibleTestCases
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error in runCode:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to run code",
    });
  }
};

/**
 * POST /api/problems/:slug/submit
 * Submit code and run against ALL test cases (including hidden) - REAL ONLINE JUDGE
 */
export const submitCode = async (req, res) => {
  try {
    const { slug } = req.params;
    const { code, language } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Code and language are required",
      });
    }

    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Validate function signature exists
    if (!problem.functionSignature) {
      return res.status(500).json({
        success: false,
        message: "Problem configuration error: missing function signature",
      });
    }

    // Run ALL test cases (including hidden) - REAL ONLINE JUDGE
    const result = await executeWithWrapper(
      language,
      code,
      problem.functionSignature,
      problem.testCases
    );

    // Update problem stats
    problem.totalSubmissions = (problem.totalSubmissions || 0) + 1;
    if (result.status === "Accepted") {
      problem.totalAccepted = (problem.totalAccepted || 0) + 1;
    }
    problem.acceptanceRate =
      (problem.totalAccepted / problem.totalSubmissions) * 100;
    await problem.save();

    // Save submission if user is authenticated
    if (userId) {
      await Submission.create({
        userId,
        problemId: problem._id,
        problemSlug: slug,
        code,
        language,
        status: result.status,
        runtime: 0, // Not tracked in new model
        testCasesPassed: result.passedCount,
        totalTestCases: result.totalCount,
        errorMessage: result.errorMessage,
      });
    }

    res.json({
      success: true,
      status: result.status,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      failedTestIndex: result.failedTestIndex,
      expectedOutput: result.expectedOutput,
      actualOutput: result.actualOutput,
      errorMessage: result.errorMessage,
      errorMessage: result.errorMessage,
    });
  } catch (error) {
    console.error("Error in submitCode:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit code",
    });
  }
};

/**
 * GET /api/problems/:slug/submissions
 * Get user's submissions for a specific problem
 */
export const getUserSubmissions = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const submissions = await Submission.find({
      userId,
      problemSlug: slug,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-code"); // Don't send code in list

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error in getUserSubmissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};

/**
 * GET /api/submissions/recent
 * Get user's recent accepted submissions
 */
export const getRecentSubmissions = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get recent accepted submissions
    const submissions = await Submission.find({
      userId,
      status: "Accepted",
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("problemId", "title difficulty tags")
      .select("problemSlug language status createdAt runtime");

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error in getRecentSubmissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};
