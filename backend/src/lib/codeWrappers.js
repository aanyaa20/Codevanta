/**
 * LeetCode-Style Code Wrapper Generator
 * Generates complete executable code by wrapping user's solution
 * 
 * METHODOLOGY:
 * 1. User writes ONLY the function/class
 * 2. We inject hidden main() with test cases
 * 3. We compile & run the full code
 * 4. Output is captured and parsed
 */

/**
 * Serialize value to C++ code representation
 */
function serializeCppValue(value, type = null) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
  
  if (Array.isArray(value)) {
    // Check if it's array of numbers, strings, etc
    if (value.length === 0) return "{}";
    const items = value.map(v => serializeCppValue(v)).join(", ");
    return `{${items}}`;
  }
  
  if (typeof value === "object") {
    // For objects, serialize as initializer list or specific structure
    return JSON.stringify(value);
  }
  
  return value.toString();
}

/**
 * Serialize value to Python code representation
 */
function serializePythonValue(value) {
  if (value === null || value === undefined) return "None";
  if (typeof value === "boolean") return value ? "True" : "False";
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
  return JSON.stringify(value);
}

/**
 * Serialize value to Java code representation
 */
function serializeJavaValue(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return `"${value.replace(/"/g, '\\"')}"`;
  
  if (Array.isArray(value)) {
    if (value.length === 0) return "new int[]{}";
    // Determine array type based on first element
    const firstType = typeof value[0];
    const items = value.map(v => serializeJavaValue(v)).join(", ");
    
    if (firstType === "number") {
      return `new int[]{${items}}`;
    } else if (firstType === "string") {
      return `new String[]{${items}}`;
    }
    return `new Object[]{${items}}`;
  }
  
  return JSON.stringify(value);
}

/**
 * Extract test case parameters from input object
 */
function extractTestInputs(input) {
  if (typeof input !== "object" || input === null) {
    return [input];
  }
  // Input is an object like { nums: [1,2,3], target: 5 }
  return Object.values(input);
}

/**
 * Generate C++ wrapper code
 */
export function generateCppWrapper(userCode, functionSignature, testCases) {
  const { functionName, parameters, returnType } = functionSignature;
  const isVoidReturn = returnType === 'void';

  // Remove any user-added includes to avoid duplication
  const cleanUserCode = userCode
    .replace(/#include\s*<bits\/stdc\+\+\.h>/g, '')
    .replace(/#include\s*<iostream>/g, '')
    .replace(/using\s+namespace\s+std;/g, '')
    .trim();

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = extractTestInputs(tc.input);
      const expected = tc.expectedOutput;
      const inputStr = JSON.stringify(tc.input).replace(/"/g, '\\"');
      
      // Create proper variable declarations for inputs
      let variableDeclarations = '';
      let callArgs = '';
      
      inputs.forEach((input, i) => {
        const varName = `input${i}`;
        if (Array.isArray(input)) {
          if (input.length > 0 && typeof input[0] === 'string') {
            const items = input.map(v => `'${v}'`).join(", ");
            variableDeclarations += `        vector<char> ${varName} = {${items}};\n`;
          } else if (input.length > 0 && typeof input[0] === 'number') {
            const items = input.join(", ");
            variableDeclarations += `        vector<int> ${varName} = {${items}};\n`;
          } else {
            variableDeclarations += `        vector<int> ${varName} = {};\n`;
          }
        } else if (typeof input === 'string') {
          variableDeclarations += `        string ${varName} = "${input.replace(/"/g, '\\"')}";\n`;
        } else if (typeof input === 'number') {
          variableDeclarations += `        int ${varName} = ${input};\n`;
        } else if (typeof input === 'boolean') {
          variableDeclarations += `        bool ${varName} = ${input ? 'true' : 'false'};\n`;
        }
        callArgs += (i > 0 ? ', ' : '') + varName;
      });
      
      // Generate type-appropriate comparison
      let functionCallCode, comparisonCode, resultStr, expectedStrCode;
      
      if (isVoidReturn) {
        // For void functions, they modify the first parameter in-place
        functionCallCode = `sol.${functionName}(${callArgs});`;
        const resultVarName = 'input0'; // The modified first parameter
        
        if (Array.isArray(expected)) {
          let expectedVec = '';
          if (expected.length > 0 && typeof expected[0] === 'string') {
            const items = expected.map(v => `'${v}'`).join(", ");
            expectedVec = `vector<char>{${items}}`;
          } else if (expected.length > 0 && typeof expected[0] === 'number') {
            const items = expected.join(", ");
            expectedVec = `vector<int>{${items}}`;
          } else {
            expectedVec = `vector<int>{}`;
          }
          comparisonCode = `!compareVectors(${resultVarName}, ${expectedVec})`;
          resultStr = `vecToString(${resultVarName})`;
          expectedStrCode = `vecToString(${expectedVec})`;
        } else {
          comparisonCode = `${resultVarName} != ${serializeCppValue(expected)}`;
          resultStr = `to_string(${resultVarName})`;
          expectedStrCode = `"${JSON.stringify(expected).replace(/"/g, '\\"')}"`;
        }
      } else {
        functionCallCode = `auto result = sol.${functionName}(${callArgs});`;
        
        if (typeof expected === 'boolean') {
          comparisonCode = `result != ${expected ? 'true' : 'false'}`;
          resultStr = `(result ? "true" : "false")`;
          expectedStrCode = `"${expected}"`;
        } else if (typeof expected === 'number') {
          comparisonCode = `result != ${expected}`;
          resultStr = `to_string(result)`;
          expectedStrCode = `"${expected}"`;
        } else if (typeof expected === 'string') {
          comparisonCode = `result != "${expected.replace(/"/g, '\\"')}"`;
          resultStr = `result`;
          expectedStrCode = `"${expected.replace(/"/g, '\\"')}"`;
        } else if (Array.isArray(expected)) {
          let expectedVec = '';
          if (expected.length > 0 && typeof expected[0] === 'string') {
            const items = expected.map(v => `'${v}'`).join(", ");
            expectedVec = `vector<char>{${items}}`;
          } else if (expected.length > 0 && typeof expected[0] === 'number') {
            const items = expected.join(", ");
            expectedVec = `vector<int>{${items}}`;
          } else {
            expectedVec = `vector<int>{}`;
          }
          comparisonCode = `!compareVectors(result, ${expectedVec})`;
          resultStr = `vecToString(result)`;
          expectedStrCode = `vecToString(${expectedVec})`;
        } else {
          comparisonCode = `result != ${serializeCppValue(expected)}`;
          resultStr = `to_string(result)`;
          expectedStrCode = `"${JSON.stringify(expected).replace(/"/g, '\\"')}"`;
        }
      }

      return `
    // Test ${idx + 1}
    {
${variableDeclarations}        ${functionCallCode}
        if (${comparisonCode}) {
            cout << "TEST|${idx}|FAIL|${inputStr}|" << ${expectedStrCode} << "|" << ${resultStr} << endl;
            cout << "FAIL|${idx}|" << ${expectedStrCode} << "|" << ${resultStr} << endl;
            return 0;
        }
        cout << "TEST|${idx}|PASS|${inputStr}|" << ${expectedStrCode} << "|" << ${resultStr} << endl;
        passed++;
    }`;
    })
    .join("\n");

  return `#include <bits/stdc++.h>
using namespace std;

// Vector comparison helper
template<typename T>
bool compareVectors(const vector<T>& a, const vector<T>& b) {
    if (a.size() != b.size()) return false;
    for (size_t i = 0; i < a.size(); i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

// Vector to string helper
template<typename T>
string vecToString(const vector<T>& vec) {
    ostringstream oss;
    oss << "[";
    for(size_t i = 0; i < vec.size(); i++) {
        if(i > 0) oss << ",";
        if (typeid(T) == typeid(char)) {
            oss << "'" << vec[i] << "'";
        } else {
            oss << vec[i];
        }
    }
    oss << "]";
    return oss.str();
}

// ===== USER CODE =====
${cleanUserCode}
// ===== END USER CODE =====

int main() {
    Solution sol;
    int passed = 0;
    int total = ${testCases.length};
    
    ${testCaseCode}
    
    cout << "PASS|" << passed << "|" << total << endl;
    return 0;
}`;
}

/**
 * Generate C wrapper code
 */
export function generateCWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  // Remove any user-added includes to avoid duplication
  const cleanUserCode = userCode
    .replace(/#include\s*<stdio\.h>/g, '')
    .replace(/#include\s*<stdlib\.h>/g, '')
    .replace(/#include\s*<string\.h>/g, '')
    .replace(/#include\s*<stdbool\.h>/g, '')
    .trim();

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = extractTestInputs(tc.input);
      const args = inputs.map(inp => serializeCppValue(inp)).join(", ");
      const expected = serializeCppValue(tc.expectedOutput);

      return `
    // Test ${idx + 1}
    {
        auto result = ${functionName}(${args});
        if (result != ${expected}) {
            printf("FAIL|${idx}|%d|%d\\n", ${expected}, result);
            return 0;
        }
        passed++;
    }`;
    })
    .join("\n");

  return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

// ===== USER CODE =====
${cleanUserCode}
// ===== END USER CODE =====

int main() {
    int passed = 0;
    int total = ${testCases.length};
    
    ${testCaseCode}
    
    printf("PASS|%d|%d\\n", passed, total);
    return 0;
}`;
}

/**
 * Generate Python wrapper code
 */
export function generatePythonWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  // Remove any duplicate imports
  const cleanUserCode = userCode
    .replace(/^import\s+json\s*$/gm, '')
    .replace(/^import\s+sys\s*$/gm, '')
    .replace(/^from\s+typing\s+import.*/gm, '')
    .trim();

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = extractTestInputs(tc.input);
      const args = inputs.map(inp => serializePythonValue(inp)).join(", ");
      const expected = serializePythonValue(tc.expectedOutput);

      return `
    # Test ${idx + 1}
    result = sol.${functionName}(${args})
    expected = ${expected}
    if result != expected:
        print(f"FAIL|${idx}|{expected}|{result}")
        return
    passed += 1`;
    })
    .join("\n");

  return `import json
import sys
from typing import List, Optional

# ===== USER CODE =====
${cleanUserCode}
# ===== END USER CODE =====

def main():
    sol = Solution()
    passed = 0
    total = ${testCases.length}
    
    ${testCaseCode}
    
    print(f"PASS|{passed}|{total}")

if __name__ == "__main__":
    main()`;
}

/**
 * Generate Java wrapper code
 */
export function generateJavaWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  // Remove any duplicate imports
  const cleanUserCode = userCode
    .replace(/^import\s+java\.util\.\*;$/gm, '')
    .replace(/^import\s+java\.util\.stream\.\*;$/gm, '')
    .trim();

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = extractTestInputs(tc.input);
      const args = inputs.map(inp => serializeJavaValue(inp)).join(", ");
      const expected = serializeJavaValue(tc.expectedOutput);

      return `
        // Test ${idx + 1}
        {
            var result = sol.${functionName}(${args});
            var expected = ${expected};
            if (!compareResults(result, expected)) {
                System.out.println("FAIL|${idx}|" + stringify(expected) + "|" + stringify(result));
                return;
            }
            passed++;
        }`;
    })
    .join("\n");

  return `import java.util.*;
import java.util.stream.*;

// ===== USER CODE =====
${cleanUserCode}
// ===== END USER CODE =====

class Main {
    static <T> boolean compareResults(T a, T b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        
        if (a instanceof int[] && b instanceof int[]) {
            return Arrays.equals((int[])a, (int[])b);
        }
        if (a instanceof String[] && b instanceof String[]) {
            return Arrays.equals((String[])a, (String[])b);
        }
        if (a instanceof List && b instanceof List) {
            return a.equals(b);
        }
        
        return a.equals(b);
    }
    
    static <T> String stringify(T obj) {
        if (obj instanceof int[]) {
            return Arrays.toString((int[])obj);
        }
        if (obj instanceof String[]) {
            return Arrays.toString((String[])obj);
        }
        if (obj instanceof List) {
            return obj.toString();
        }
        return String.valueOf(obj);
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        int passed = 0;
        int total = ${testCases.length};
        
        ${testCaseCode}
        
        System.out.println("PASS|" + passed + "|" + total);
    }
}`;
}

/**
 * Generate JavaScript wrapper code
 */
export function generateJavaScriptWrapper(userCode, functionSignature, testCases) {
  const { functionName } = functionSignature;

  const testCaseCode = testCases
    .map((tc, idx) => {
      const inputs = extractTestInputs(tc.input);
      const args = inputs.map(inp => JSON.stringify(inp)).join(", ");
      const expected = JSON.stringify(tc.expectedOutput);

      return `
    // Test ${idx + 1}
    {
        const result = ${functionName}(${args});
        const expected = ${expected};
        if (!deepEqual(result, expected)) {
            console.log(\`FAIL|${idx}|\${JSON.stringify(expected)}|\${JSON.stringify(result)}\`);
            return;
        }
        passed++;
    }`;
    })
    .join("\n");

  return `// Deep equality check
function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((val, idx) => deepEqual(val, b[idx]));
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(key => deepEqual(a[key], b[key]));
    }
    
    return false;
}

// ===== USER CODE =====
${userCode}
// ===== END USER CODE =====

(function main() {
    let passed = 0;
    const total = ${testCases.length};
    
    ${testCaseCode}
    
    console.log(\`PASS|\${passed}|\${total}\`);
})();`;
}

/**
 * Main wrapper generator - routes to language-specific generator
 */
export function generateCodeWrapper(language, userCode, functionSignature, testCases) {
  switch (language) {
    case "cpp":
      return generateCppWrapper(userCode, functionSignature, testCases);
    case "c":
      return generateCWrapper(userCode, functionSignature, testCases);
    case "python":
      return generatePythonWrapper(userCode, functionSignature, testCases);
    case "java":
      return generateJavaWrapper(userCode, functionSignature, testCases);
    case "javascript":
      return generateJavaScriptWrapper(userCode, functionSignature, testCases);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

/**
 * Parse execution output to determine verdict
 */
export function parseExecutionOutput(stdout, testCases) {
  const lines = stdout.trim().split("\n");
  const lastLine = lines[lines.length - 1] || "";

  // Extract individual test case results from TEST| lines
  const testCaseResults = [];
  for (const line of lines) {
    if (line.startsWith("TEST|")) {
      const parts = line.split("|");
      const idx = parseInt(parts[1]);
      const status = parts[2]; // PASS or FAIL
      const input = parts[3];
      const expected = parts[4];
      const actual = parts[5];

      testCaseResults.push({
        passed: status === "PASS",
        input: input,
        expected: expected,
        actual: actual
      });
    }
  }

  // Format: "PASS|5|5" or "FAIL|2|expected|actual"
  if (lastLine.startsWith("PASS|")) {
    const parts = lastLine.split("|");
    const passed = parseInt(parts[1]);
    const total = parseInt(parts[2]);

    return {
      status: "Accepted",
      passedCount: passed,
      totalCount: total,
      failedTestIndex: null,
      expectedOutput: null,
      actualOutput: null,
      errorMessage: null,
      testCaseResults: testCaseResults,
    };
  }

  if (lastLine.startsWith("FAIL|")) {
    const parts = lastLine.split("|");
    const failedIdx = parseInt(parts[1]);
    const expected = parts[2];
    const actual = parts[3];

    return {
      status: "Wrong Answer",
      passedCount: failedIdx,
      totalCount: testCases ? testCases.length : -1,
      failedTestIndex: failedIdx,
      expectedOutput: expected,
      actualOutput: actual,
      errorMessage: `Test case ${failedIdx + 1} failed`,
      testCaseResults: testCaseResults,
    };
  }

  // Unknown output format
  return {
    status: "Runtime Error",
    passedCount: 0,
    totalCount: testCases ? testCases.length : -1,
    failedTestIndex: 0,
    expectedOutput: null,
    actualOutput: null,
    errorMessage: "Unexpected output format",
    testCaseResults: testCaseResults,
  };
}
