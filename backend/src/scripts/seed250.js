import mongoose from "mongoose";
import { ENV } from "../lib/env.js";
import Problem from "../models/Problem.js";

// 250 LeetCode-style problems - First 10 handcrafted, rest generated
const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: ["2 <= nums.length <= 10^4"],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
    functionSignature: { functionName: "twoSum", returnType: "int[]", parameters: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }] },
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Your code here\n}`,
      python: `def twoSum(nums, target):\n    # Your code here\n    pass`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}`,
      java: `public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[2,7,11,15], 9], expectedOutput: [0,1], hidden: false }, { input: [[3,2,4], 6], expectedOutput: [1,2], hidden: true }],
    tags: ["Array", "Hash Table"]
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse the input string.",
    constraints: ["1 <= s.length <= 10^5"],
    examples: [{ input: 's = "hello"', output: '"olleh"' }],
    functionSignature: { functionName: "reverseString", returnType: "string", parameters: [{ name: "s", type: "string" }] },
    starterCode: {
      javascript: `function reverseString(s) {\n    // Your code here\n}`,
      python: `def reverseString(s):\n    # Your code here\n    pass`,
      cpp: `string reverseString(string s) {\n    // Your code here\n}`,
      java: `public String reverseString(String s) {\n    // Your code here\n}`
    },
    testCases: [{ input: ["hello"], expectedOutput: "olleh", hidden: false }, { input: ["world"], expectedOutput: "dlrow", hidden: true }],
    tags: ["String"]
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Determine if an integer is a palindrome.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    examples: [{ input: "x = 121", output: "true" }],
    functionSignature: { functionName: "isPalindrome", returnType: "boolean", parameters: [{ name: "x", type: "int" }] },
    starterCode: {
      javascript: `function isPalindrome(x) {\n    // Your code here\n}`,
      python: `def isPalindrome(x):\n    # Your code here\n    pass`,
      cpp: `bool isPalindrome(int x) {\n    // Your code here\n}`,
      java: `public boolean isPalindrome(int x) {\n    // Your code here\n}`
    },
    testCases: [{ input: [121], expectedOutput: true, hidden: false }, { input: [-121], expectedOutput: false, hidden: true }],
    tags: ["Math"]
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Determine if parentheses string is valid.",
    constraints: ["1 <= s.length <= 10^4"],
    examples: [{ input: 's = "()"', output: "true" }],
    functionSignature: { functionName: "isValid", returnType: "boolean", parameters: [{ name: "s", type: "string" }] },
    starterCode: {
      javascript: `function isValid(s) {\n    // Your code here\n}`,
      python: `def isValid(s):\n    # Your code here\n    pass`,
      cpp: `bool isValid(string s) {\n    // Your code here\n}`,
      java: `public boolean isValid(String s) {\n    // Your code here\n}`
    },
    testCases: [{ input: ["()"], expectedOutput: true, hidden: false }, { input: ["(]"], expectedOutput: false, hidden: true }],
    tags: ["String", "Stack"]
  },
  {
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description: "Merge two sorted arrays.",
    constraints: ["nums1.length == m + n"],
    examples: [{ input: "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3", output: "[1,2,2,3,5,6]" }],
    functionSignature: { functionName: "merge", returnType: "void", parameters: [{ name: "nums1", type: "int[]" }, { name: "m", type: "int" }, { name: "nums2", type: "int[]" }, { name: "n", type: "int" }] },
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {\n    // Your code here\n}`,
      python: `def merge(nums1, m, nums2, n):\n    # Your code here\n    pass`,
      cpp: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    // Your code here\n}`,
      java: `public void merge(int[] nums1, int m, int[] nums2, int n) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[1,2,3,0,0,0], 3, [2,5,6], 3], expectedOutput: [1,2,2,3,5,6], hidden: false }],
    tags: ["Array"]
  },
  {
    slug: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "Maximize profit from stock prices.",
    constraints: ["1 <= prices.length <= 10^5"],
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }],
    functionSignature: { functionName: "maxProfit", returnType: "int", parameters: [{ name: "prices", type: "int[]" }] },
    starterCode: {
      javascript: `function maxProfit(prices) {\n    // Your code here\n}`,
      python: `def maxProfit(prices):\n    # Your code here\n    pass`,
      cpp: `int maxProfit(vector<int>& prices) {\n    // Your code here\n}`,
      java: `public int maxProfit(int[] prices) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[7,1,5,3,6,4]], expectedOutput: 5, hidden: false }],
    tags: ["Array", "DP"]
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Check if array contains duplicates.",
    constraints: ["1 <= nums.length <= 10^5"],
    examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
    functionSignature: { functionName: "containsDuplicate", returnType: "boolean", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n    // Your code here\n}`,
      python: `def containsDuplicate(nums):\n    # Your code here\n    pass`,
      cpp: `bool containsDuplicate(vector<int>& nums) {\n    // Your code here\n}`,
      java: `public boolean containsDuplicate(int[] nums) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[1,2,3,1]], expectedOutput: true, hidden: false }],
    tags: ["Array", "Hash Table"]
  },
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    description: "Find the number that appears once.",
    constraints: ["1 <= nums.length <= 3*10^4"],
    examples: [{ input: "nums = [2,2,1]", output: "1" }],
    functionSignature: { functionName: "singleNumber", returnType: "int", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      javascript: `function singleNumber(nums) {\n    // Your code here\n}`,
      python: `def singleNumber(nums):\n    # Your code here\n    pass`,
      cpp: `int singleNumber(vector<int>& nums) {\n    // Your code here\n}`,
      java: `public int singleNumber(int[] nums) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[2,2,1]], expectedOutput: 1, hidden: false }],
    tags: ["Array", "Bit Manipulation"]
  },
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Move all zeros to end.",
    constraints: ["1 <= nums.length <= 10^4"],
    examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }],
    functionSignature: { functionName: "moveZeroes", returnType: "void", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      javascript: `function moveZeroes(nums) {\n    // Your code here\n}`,
      python: `def moveZeroes(nums):\n    # Your code here\n    pass`,
      cpp: `void moveZeroes(vector<int>& nums) {\n    // Your code here\n}`,
      java: `public void moveZeroes(int[] nums) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[0,1,0,3,12]], expectedOutput: [1,3,12,0,0], hidden: false }],
    tags: ["Array"]
  },
  {
    slug: "intersection-arrays",
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    description: "Find intersection of two arrays.",
    constraints: ["1 <= nums.length <= 1000"],
    examples: [{ input: "nums1=[1,2,2,1], nums2=[2,2]", output: "[2]" }],
    functionSignature: { functionName: "intersection", returnType: "int[]", parameters: [{ name: "nums1", type: "int[]" }, { name: "nums2", type: "int[]" }] },
    starterCode: {
      javascript: `function intersection(nums1, nums2) {\n    // Your code here\n}`,
      python: `def intersection(nums1, nums2):\n    # Your code here\n    pass`,
      cpp: `vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n}`,
      java: `public int[] intersection(int[] nums1, int[] nums2) {\n    // Your code here\n}`
    },
    testCases: [{ input: [[1,2,2,1], [2,2]], expectedOutput: [2], hidden: false }],
    tags: ["Array", "Hash Table"]
  }
];

// Generate 240 more problems
for (let i = 11; i <= 250; i++) {
  const diffOrder = ["Easy", "Easy", "Easy", "Easy", "Medium", "Medium", "Medium", "Medium", "Hard", "Hard"];
  const diff = diffOrder[i % 10];
  const cats = ["Array", "String", "Hash Table", "Tree", "Graph", "DP", "Math", "Stack", "Queue", "Linked List"];
  const cat = cats[i % 10];
  
  problems.push({
    slug: `problem-${i}`,
    title: `${cat} Problem ${i}`,
    difficulty: diff,
    description: `Solve this ${cat} problem efficiently. Problem #${i}.`,
    constraints: [`1 <= n <= 10^5`],
    examples: [{ input: "n = 5", output: "result" }],
    functionSignature: { functionName: "solve", returnType: "int", parameters: [{ name: "n", type: "int" }] },
    starterCode: {
      javascript: `function solve(n) {\n    // Your code here\n}`,
      python: `def solve(n):\n    # Your code here\n    pass`,
      cpp: `int solve(int n) {\n    // Your code here\n}`,
      java: `public int solve(int n) {\n    // Your code here\n}`
    },
    testCases: [{ input: [5], expectedOutput: 5, hidden: false }, { input: [10], expectedOutput: 10, hidden: true }],
    tags: [cat]
  });
}

async function seed() {
  try {
    console.log("Connecting...");
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected");
    console.log(" Clearing...");
    await Problem.deleteMany({});
    console.log("✅ Cleared");
    console.log(" Inserting 250 problems...");
    await Problem.insertMany(problems);
    console.log("✅ 250 problems inserted!");
    console.log(` Easy: ${problems.filter(p=>p.difficulty==="Easy").length}, Medium: ${problems.filter(p=>p.difficulty==="Medium").length}, Hard: ${problems.filter(p=>p.difficulty==="Hard").length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
