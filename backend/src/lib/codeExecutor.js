import axios from "axios";
import { generateCodeWrapper, parseExecutionOutput } from "./codeWrappers.js";

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_CONFIG = {
  cpp: { language: "cpp", version: "10.2.0", extension: "cpp" },
  python: { language: "python", version: "3.10.0", extension: "py" },
  javascript: { language: "javascript", version: "18.15.0", extension: "js" },
  java: { language: "java", version: "15.0.2", extension: "java" },
};

/**
 * Execute user code with online judge wrapper (REAL LEETCODE-STYLE)
 * Users write ONLY the solution function, we inject test cases via wrapper
 * 
 * @param {string} language - Programming language
 * @param {string} userCode - User's solution function ONLY
 * @param {object} functionSignature - Function metadata {functionName, returnType, parameters}
 * @param {array} testCases - Test cases to run [{input, expectedOutput}]
 * @returns {Promise<object>} Execution result with detailed status
 */
export async function executeWithWrapper(language, userCode, functionSignature, testCases) {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    // Generate complete code with hidden driver/main code
    const wrappedCode = generateCodeWrapper(language, userCode, functionSignature, testCases);

    // Execute via Piston API
    const response = await axios.post(
      `${PISTON_API}/execute`,
      {
        language: config.language,
        version: config.version,
        files: [
          {
            name: language === "java" ? "Main.java" : `main.${config.extension}`,
            content: wrappedCode,
          },
        ],
        stdin: "",
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      },
      {
        timeout: 15000,
      }
    );

    const result = response.data;

    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      return {
        status: "Compilation Error",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: result.compile.stderr || result.compile.output,
      };
    }

    // Parse execution output
    const stdout = result.run?.stdout || "";
    const stderr = result.run?.stderr || "";

    if (stderr) {
      return {
        status: "Runtime Error",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: stderr,
      };
    }

    const parsed = parseExecutionOutput(stdout);
    if (!parsed.totalCount) {
      parsed.totalCount = testCases.length;
    }

    return parsed;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return {
        status: "Time Limit Exceeded",
        passedCount: 0,
        totalCount: testCases.length,
        failedTestIndex: 0,
        expectedOutput: null,
        actualOutput: null,
        errorMessage: "Execution exceeded time limit",
      };
    }
    throw error;
  }
}
