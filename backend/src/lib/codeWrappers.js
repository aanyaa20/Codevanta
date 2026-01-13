/**
 * Language-specific code wrapper templates for Online Judge
 * Users write ONLY the solution function
 * These templates inject user code into hidden driver/main code
 */

/**
 * Serialize JavaScript value to string representation
 */
function serializeJS(value) {
  return JSON.stringify(value);
}

/**
 * Generate C++ wrapper code
 * @param {string} userCode - User's solution function
 * @param {object} functionSignature - {functionName, returnType, parameters}
 * @param {array} testCases - Array of {input, expectedOutput}
 * @returns {string} Complete C++ code with main()
 */
export function generateCppWrapper(userCode, functionSignature, testCases) {
  const { functionName, returnType, parameters } = functionSignature;

  // Check if user code contains a class or is standalone
  const hasClass = userCode.includes('class Solution') || userCode.includes('class solution');
  
  // Build parameter list for function call
  const paramList = parameters.map((p) => p.name).join(", ");

  // Generate test case execution code
  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = Array.isArray(tc.input) ? tc.input : [tc.input];
      const inputStr = inputs.map((inp) => serializeCppValue(inp)).join(", ");
      const expectedStr = serializeCppValue(tc.expectedOutput);

      // Call function based on whether we have a class or standalone function
      const functionCall = hasClass ? `sol.${functionName}(${inputStr})` : `${functionName}(${inputStr})`;

      return `
    // Test Case ${idx + 1}
    {
        auto result = ${functionCall};
        auto expected = ${expectedStr};
        if (result != expected) {
            cout << "FAILED|${idx}|" << expected << "|";
            printValue(result);
            cout << endl;
            return 0;
        }
        passed++;
    }`;
    })
    .join("\n");

  // If user didn't write a class, wrap their code in a Solution class
  const wrappedUserCode = hasClass ? userCode : `
class Solution {
public:
${userCode}
};`;

  return `#include <bits/stdc++.h>
using namespace std;

// Helper function to print values
template<typename T>
void printValue(const T& val) {
    cout << val;
}

template<typename T>
void printValue(const vector<T>& vec) {
    cout << "[";
    for(int i = 0; i < vec.size(); i++) {
        if(i > 0) cout << ",";
        printValue(vec[i]);
    }
    cout << "]";
}

// USER CODE START
${wrappedUserCode}
// USER CODE END

int main() {
    Solution sol;
    int passed = 0;
    int total = ${testCases.length};
    
    ${testCaseCode}
    
    cout << "PASSED|" << passed << "|" << total << endl;
    return 0;
}`;
}

/**
 * Generate Python wrapper code
 * @param {string} userCode - User's solution function
 * @param {object} functionSignature - {functionName, returnType, parameters}
 * @param {array} testCases - Array of {input, expectedOutput}
 * @returns {string} Complete Python code with driver
 */
export function generatePythonWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  // Check if user code contains a class
  const hasClass = userCode.includes('class Solution') || userCode.includes('class solution');

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = Array.isArray(tc.input) ? tc.input : [tc.input];
      const inputStr = inputs.map((inp) => serializeJS(inp)).join(", ");
      const expectedStr = serializeJS(tc.expectedOutput);

      // Call function based on whether we have a class or standalone
      const functionCall = hasClass ? `sol.${functionName}(${inputStr})` : `${functionName}(${inputStr})`;

      return `
    # Test Case ${idx + 1}
    try:
        result = ${functionCall}
        expected = ${expectedStr}
        if result != expected:
            print(f"FAILED|${idx}|{expected}|{result}")
            return
        passed += 1
    except Exception as e:
        print(f"ERROR|${idx}|{str(e)}")
        return`;
    })
    .join("\n");

  // If user didn't write a class, wrap their code
  const wrappedUserCode = hasClass ? userCode : `
class Solution:
${userCode.split('\n').map(line => '    ' + line).join('\n')}
`;

  const setupCode = hasClass ? "sol = Solution()" : "sol = Solution()";

  return `import sys
import json

# USER CODE START
${wrappedUserCode}
# USER CODE END

def main():
    ${setupCode}
    passed = 0
    total = ${testCases.length}
    
    ${testCaseCode}
    
    print(f"PASSED|{passed}|{total}")

if __name__ == "__main__":
    main()`;
}

/**
 * Generate JavaScript wrapper code
 * @param {string} userCode - User's solution function
 * @param {object} functionSignature - {functionName, returnType, parameters}
 * @param {array} testCases - Array of {input, expectedOutput}
 * @returns {string} Complete JavaScript code with runner
 */
export function generateJavaScriptWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  // Check if user code contains a class
  const hasClass = userCode.includes('class Solution') || userCode.includes('class solution');

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = Array.isArray(tc.input) ? tc.input : [tc.input];
      const inputStr = inputs.map((inp) => serializeJS(inp)).join(", ");
      const expectedStr = serializeJS(tc.expectedOutput);

      // Call function based on whether we have a class or standalone
      const functionCall = hasClass ? `sol.${functionName}(${inputStr})` : `${functionName}(${inputStr})`;

      return `
    // Test Case ${idx + 1}
    try {
        const result = ${functionCall};
        const expected = ${expectedStr};
        if (JSON.stringify(result) !== JSON.stringify(expected)) {
            console.log(\`FAILED|${idx}|\${JSON.stringify(expected)}|\${JSON.stringify(result)}\`);
            return;
        }
        passed++;
    } catch (e) {
        console.log(\`ERROR|${idx}|\${e.message}\`);
        return;
    }`;
    })
    .join("\n");

  // If user didn't write a class, wrap their code
  const wrappedUserCode = hasClass ? userCode : `
class Solution {
${userCode}
}
`;

  const setupCode = hasClass ? "const sol = new Solution();" : "const sol = new Solution();";

  return `// USER CODE START
${wrappedUserCode}
// USER CODE END

function main() {
    ${setupCode}
    let passed = 0;
    const total = ${testCases.length};
    
    ${testCaseCode}
    
    console.log(\`PASSED|\${passed}|\${total}\`);
}

main();`;
}

/**
 * Generate Java wrapper code
 * @param {string} userCode - User's solution function
 * @param {object} functionSignature - {functionName, returnType, parameters}
 * @param {array} testCases - Array of {input, expectedOutput}
 * @returns {string} Complete Java code with main()
 */
export function generateJavaWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = Array.isArray(tc.input) ? tc.input : [tc.input];
      const inputStr = inputs.map((inp) => serializeJavaValue(inp)).join(", ");
      const expectedStr = serializeJavaValue(tc.expectedOutput);

      return `
        // Test Case ${idx + 1}
        try {
            var result = sol.${functionName}(${inputStr});
            var expected = ${expectedStr};
            if (!compareValues(result, expected)) {
                System.out.println("FAILED|${idx}|" + expected + "|" + result);
                return;
            }
            passed++;
        } catch (Exception e) {
            System.out.println("ERROR|${idx}|" + e.getMessage());
            return;
        }`;
    })
    .join("\n");

  return `import java.util.*;

// USER CODE START
${userCode}
// USER CODE END

public class Main {
    private static boolean compareValues(Object a, Object b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        
        if (a instanceof int[] && b instanceof int[]) {
            return Arrays.equals((int[])a, (int[])b);
        }
        if (a instanceof List && b instanceof List) {
            return a.equals(b);
        }
        return a.equals(b);
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int passed = 0;
        int total = ${testCases.length};
        
        ${testCaseCode}
        
        System.out.println("PASSED|" + passed + "|" + total);
    }
}`;
}

/**
 * Helper function to serialize C++ values
 */
function serializeCppValue(value) {
  if (Array.isArray(value)) {
    const elements = value.map((v) => serializeCppValue(v)).join(", ");
    // Detect type from first element
    if (value.length > 0) {
      if (typeof value[0] === "number") {
        return `vector<int>{${elements}}`;
      } else if (typeof value[0] === "string") {
        return `vector<string>{${elements}}`;
      } else if (Array.isArray(value[0])) {
        return `vector<vector<int>>{${elements}}`;
      }
    }
    return `vector<int>{${elements}}`;
  }
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

/**
 * Helper function to serialize Java values
 */
function serializeJavaValue(value) {
  if (Array.isArray(value)) {
    const elements = value.map((v) => serializeJavaValue(v)).join(", ");
    if (value.length > 0 && Array.isArray(value[0])) {
      // 2D array
      return `new int[][]{{${elements}}}`;
    }
    return `new int[]{${elements}}`;
  }
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

/**
 * Main wrapper generation function
 * @param {string} language - Programming language
 * @param {string} userCode - User's solution code
 * @param {object} functionSignature - Function metadata
 * @param {array} testCases - Test cases to inject
 * @returns {string} Complete wrapped code
 */
export function generateCodeWrapper(language, userCode, functionSignature, testCases) {
  switch (language) {
    case "cpp":
      return generateCppWrapper(userCode, functionSignature, testCases);
    case "python":
      return generatePythonWrapper(userCode, functionSignature, testCases);
    case "javascript":
      return generateJavaScriptWrapper(userCode, functionSignature, testCases);
    case "java":
      return generateJavaWrapper(userCode, functionSignature, testCases);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

/**
 * Parse execution output from wrapped code
 * @param {string} output - stdout from execution
 * @returns {object} Parsed result
 */
export function parseExecutionOutput(output) {
  const lines = output.trim().split("\n");
  const lastLine = lines[lines.length - 1];

  if (lastLine.startsWith("PASSED|")) {
    const parts = lastLine.split("|");
    const passed = parseInt(parts[1]);
    const total = parseInt(parts[2]);

    return {
      status: passed === total ? "Accepted" : "Wrong Answer",
      passedCount: passed,
      totalCount: total,
      failedTestIndex: null,
      expectedOutput: null,
      actualOutput: null,
      errorMessage: null,
    };
  }

  if (lastLine.startsWith("FAILED|")) {
    const parts = lastLine.split("|");
    const failedIndex = parseInt(parts[1]);
    const expected = parts[2];
    const actual = parts[3];

    return {
      status: "Wrong Answer",
      passedCount: failedIndex,
      totalCount: null,
      failedTestIndex: failedIndex,
      expectedOutput: expected,
      actualOutput: actual,
      errorMessage: null,
    };
  }

  if (lastLine.startsWith("ERROR|")) {
    const parts = lastLine.split("|");
    const failedIndex = parseInt(parts[1]);
    const errorMsg = parts[2];

    return {
      status: "Runtime Error",
      passedCount: failedIndex,
      totalCount: null,
      failedTestIndex: failedIndex,
      expectedOutput: null,
      actualOutput: null,
      errorMessage: errorMsg,
    };
  }

  // Couldn't parse - likely compilation error or timeout
  return {
    status: output.includes("timeout") ? "Time Limit Exceeded" : "Compilation Error",
    passedCount: 0,
    totalCount: null,
    failedTestIndex: 0,
    expectedOutput: null,
    actualOutput: null,
    errorMessage: output,
  };
}
