/**
 * LeetCode-Style Code Executor
 * Executes wrapped user code using Piston API
 * 
 * FLOW:
 * 1. Receive user's solution code (function only)
 * 2. Generate complete executable code with test cases
 * 3. Send to Piston API for compilation & execution
 * 4. Parse output and return verdict
 */

import axios from "axios";
import { generateCodeWrapper, parseExecutionOutput } from "./codeWrappers.js";

const PISTON_API = "https://emkc.org/api/v2/piston";

// Piston API language mappings
const LANGUAGE_CONFIG = {
  cpp: { language: "c++", version: "10.2.0", extension: "cpp" },
  c: { language: "c", version: "10.2.0", extension: "c" },
  python: { language: "python", version: "3.10.0", extension: "py" },
  javascript: { language: "javascript", version: "18.15.0", extension: "js" },
  java: { language: "java", version: "15.0.2", extension: "java" },
};

/**
 * Execute user code with LeetCode-style wrapper
 * 
 * @param {string} language - Programming language (cpp, c, python, java, javascript)
 * @param {string} userCode - User's solution code (function/class only)
 * @param {object} functionSignature - Function metadata from problem
 * @param {array} testCases - Array of test cases [{input, expectedOutput, hidden}]
 * @returns {Promise<object>} Execution result with verdict
 */
export async function executeWithWrapper(language, userCode, functionSignature, testCases) {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    // Step 1: Generate complete executable code
    const wrappedCode = generateCodeWrapper(language, userCode, functionSignature, testCases);

    // Determine filename based on language
    let filename;
    if (language === "java") {
      filename = "Main.java"; // Java requires specific class name
    } else {
      filename = `main.${config.extension}`;
    }

    // Step 2: Execute via Piston API
    const response = await axios.post(
      `${PISTON_API}/execute`,
      {
        language: config.language,
        version: config.version,
        files: [
          {
            name: filename,
            content: wrappedCode,
          },
        ],
        stdin: "", // We inject test cases in code, not via stdin
        compile_timeout: 10000, // 10 seconds
        run_timeout: 5000, // 5 seconds (TLE check)
        compile_memory_limit: -1,
        run_memory_limit: -1,
      },
      {
        timeout: 15000, // HTTP timeout
      }
    );

    const result = response.data;

    // Step 3: Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      return {
        status: "Compilation Error",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: result.compile.stderr || result.compile.output || "Compilation failed",
        testCaseResults: [],
      };
    }

    // Step 4: Check runtime errors
    const stdout = result.run?.stdout || "";
    const stderr = result.run?.stderr || "";
    const exitCode = result.run?.code || 0;

    if (exitCode !== 0 || stderr) {
      return {
        status: "Runtime Error",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: stderr || `Process exited with code ${exitCode}`,
        testCaseResults: [],
      };
    }

    // Step 5: Parse output and determine verdict
    const parsed = parseExecutionOutput(stdout, testCases);

    // Set total count if not already set
    if (parsed.totalCount === -1) {
      parsed.totalCount = testCases.length;
    }

    return parsed;
  } catch (error) {
    // Handle timeouts and network errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        status: "Time Limit Exceeded",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: "Code execution took too long (5 second limit)",
        testCaseResults: [],
      };
    }

    // Handle Piston API errors
    if (error.response) {
      return {
        status: "Runtime Error",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: error.response.data?.message || "Execution service error",
        testCaseResults: [],
      };
    }

    // Generic error
    throw error;
  }
}

/**
 * Get available Piston runtimes (for debugging/admin)
 */
export async function getAvailableRuntimes() {
  try {
    const response = await axios.get(`${PISTON_API}/runtimes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching runtimes:", error);
    return [];
  }
}
