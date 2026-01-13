import mongoose from "mongoose";
import { ENV } from "../lib/env.js";
import Problem from "../models/Problem.js";

// 250 LeetCode-style problems - First 10 handcrafted, rest generated
const problems = [
  {
    slug: "two-sum",
    title: "1. Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }],
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
    title: "2. Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
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
    title: "3. Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    examples: [{ input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." }, { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome." }],
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
    title: "4. Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    examples: [{ input: 's = "()"', output: "true" }, { input: 's = "()[]{}"', output: "true" }, { input: 's = "(]"', output: "false" }],
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
    title: "5. Merge Sorted Array",
    difficulty: "Easy",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.",
    constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200", "1 <= m + n <= 200"],
    examples: [{ input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]", explanation: "The arrays we are merging are [1,2,3] and [2,5,6]. The result is [1,2,2,3,5,6]." }],
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
    title: "6. Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell." }],
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
    title: "7. Contains Duplicate",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    examples: [{ input: "nums = [1,2,3,1]", output: "true" }, { input: "nums = [1,2,3,4]", output: "false" }],
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

// Generate 240 more problems with better descriptions
const problemTemplates = {
  "Array": {
    titles: ["Find Maximum Subarray", "Rotate Array", "Remove Duplicates", "Find Missing Number", "Product Except Self"],
    descriptions: [
      "Given an array of integers, find the contiguous subarray with the largest sum. Return the maximum sum.",
      "Given an array, rotate the array to the right by k steps, where k is non-negative.",
      "Given a sorted array, remove the duplicates in-place such that each element appears only once.",
      "Given an array containing n distinct numbers from 0 to n, find the missing number.",
      "Given an array nums, return an array output where output[i] is the product of all elements except nums[i]."
    ]
  },
  "String": {
    titles: ["Longest Substring", "Valid Anagram", "Group Anagrams", "Longest Palindrome", "String Compression"],
    descriptions: [
      "Given a string, find the length of the longest substring without repeating characters.",
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      "Given an array of strings, group all anagrams together. Return the answer in any order.",
      "Given a string s, return the longest palindromic substring in s.",
      "Implement a method to perform basic string compression using counts of repeated characters."
    ]
  },
  "Hash Table": {
    titles: ["Two Sum Variant", "Valid Sudoku", "Isomorphic Strings", "Happy Number", "Unique Paths"],
    descriptions: [
      "Given an array of integers and a target, find all unique pairs that sum to the target.",
      "Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated.",
      "Given two strings s and t, determine if they are isomorphic.",
      "Write an algorithm to determine if a number n is happy. A happy number eventually reaches 1.",
      "A robot is located at the top-left corner of a grid. Count how many possible unique paths exist."
    ]
  },
  "Tree": {
    titles: ["Binary Tree Inorder", "Maximum Depth", "Symmetric Tree", "Path Sum", "Level Order Traversal"],
    descriptions: [
      "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      "Given the root of a binary tree, return its maximum depth.",
      "Given the root of a binary tree, check whether it is a mirror of itself (symmetric).",
      "Given the root of a binary tree and an integer targetSum, return true if the tree has a path that sums to targetSum.",
      "Given the root of a binary tree, return the level order traversal of its nodes' values."
    ]
  },
  "Graph": {
    titles: ["Number of Islands", "Clone Graph", "Course Schedule", "Network Delay", "Minimum Height Trees"],
    descriptions: [
      "Given a 2D grid of '1's (land) and '0's (water), count the number of islands.",
      "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
      "Determine if you can finish all courses given prerequisites. Return true if possible.",
      "Given a network of nodes and times, find the time it takes for all nodes to receive a signal.",
      "A tree is an undirected graph where any two vertices are connected. Find all minimum height trees."
    ]
  },
  "DP": {
    titles: ["Climbing Stairs", "House Robber", "Coin Change", "Longest Increasing", "Edit Distance"],
    descriptions: [
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.",
      "You are a robber planning to rob houses. Each house has a certain amount of money. Adjacent houses have security systems.",
      "Given coins of different denominations and a total amount, compute the fewest coins needed.",
      "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
      "Given two strings word1 and word2, return the minimum number of operations to convert word1 to word2."
    ]
  },
  "Math": {
    titles: ["Pow(x, n)", "Sqrt(x)", "Factorial Trailing", "Count Primes", "Reverse Integer"],
    descriptions: [
      "Implement pow(x, n), which calculates x raised to the power n.",
      "Given a non-negative integer x, compute and return the square root of x.",
      "Given an integer n, return the number of trailing zeroes in n factorial.",
      "Count the number of prime numbers less than a non-negative integer n.",
      "Given a signed 32-bit integer x, return x with its digits reversed."
    ]
  },
  "Stack": {
    titles: ["Min Stack", "Valid Parentheses", "Daily Temperatures", "Evaluate Expression", "Largest Rectangle"],
    descriptions: [
      "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input is valid.",
      "Given an array of temperatures, return an array answer such that answer[i] is the number of days until a warmer temperature.",
      "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
      "Given an array of integers heights representing the histogram's bar height, find the area of largest rectangle."
    ]
  },
  "Queue": {
    titles: ["Implement Queue", "Recent Counter", "Moving Average", "Perfect Squares", "Open the Lock"],
    descriptions: [
      "Implement a queue using two stacks. Support push, pop, peek, and empty operations.",
      "Design a class that counts recent requests within a time window.",
      "Given a stream of integers and a window size, calculate the moving average.",
      "Given an integer n, return the least number of perfect square numbers that sum to n.",
      "You have a lock with 4 circular wheels. Each wheel has digits 0-9. Return minimum turns to unlock."
    ]
  },
  "Linked List": {
    titles: ["Reverse Linked List", "Merge Two Lists", "Linked List Cycle", "Remove Nth Node", "Palindrome List"],
    descriptions: [
      "Given the head of a singly linked list, reverse the list and return the reversed list.",
      "Merge two sorted linked lists and return it as a sorted list.",
      "Given head of a linked list, determine if it has a cycle in it.",
      "Given the head of a linked list, remove the nth node from the end of the list.",
      "Given the head of a singly linked list, return true if it is a palindrome."
    ]
  }
};

for (let i = 11; i <= 250; i++) {
  const diffOrder = ["Easy", "Easy", "Easy", "Easy", "Medium", "Medium", "Medium", "Medium", "Hard", "Hard"];
  const diff = diffOrder[i % 10];
  const cats = ["Array", "String", "Hash Table", "Tree", "Graph", "DP", "Math", "Stack", "Queue", "Linked List"];
  const catIndex = i % 10;
  const cat = cats[catIndex];
  const template = problemTemplates[cat];
  const titleIndex = Math.floor((i - 11) / 48) % template.titles.length;
  const descIndex = Math.floor((i - 11) / 48) % template.descriptions.length;
  
  problems.push({
    slug: `${template.titles[titleIndex].toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}-${i}`,
    title: `${i}. ${template.titles[titleIndex]}`,
    difficulty: diff,
    description: `${template.descriptions[descIndex]}\n\nImplement an efficient solution that handles all edge cases.\n\nFollow-up: Can you solve it in O(n) time complexity?`,
    constraints: [`1 <= n <= 10^5`, `-10^9 <= values <= 10^9`, `All inputs are valid`],
    examples: [
      { input: "n = 5", output: "result", explanation: "This is an example showing how the algorithm works with input n=5." },
      { input: "n = 10", output: "result", explanation: "Another test case with larger input." }
    ],
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
