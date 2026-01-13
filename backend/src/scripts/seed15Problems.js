import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { ENV } from "../lib/env.js";

const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: ["2 <= nums.length <= 10^4"],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Your code here\n}\nconsole.log(JSON.stringify(twoSum([2,7,11,15], 9)));`,
      python: `def twoSum(nums, target):\n    # Your code here\n    pass\nprint(twoSum([2,7,11,15], 9))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {2,7,11,15};\n    auto result = twoSum(nums, 9);\n    cout << "[" << result[0] << "," << result[1] << "]";\n}`,
      java: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        int[] result = s.twoSum(new int[]{2,7,11,15}, 9);\n        System.out.println("[" + result[0] + "," + result[1] + "]");\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "[0,1]", hidden: false },
      { input: "", expectedOutput: "[1,2]", hidden: true }
    ],
    tags: ["Array", "Hash Table"]
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string.",
    constraints: ["1 <= s.length <= 10^5"],
    examples: [{ input: 's = "hello"', output: '"olleh"' }],
    starterCode: {
      javascript: `function reverseString(s) {\n    // Your code here\n}\nconsole.log(reverseString("hello"));`,
      python: `def reverseString(s):\n    # Your code here\n    pass\nprint(reverseString("hello"))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nstring reverseString(string s) {\n    // Your code here\n}\nint main(){\n    cout << reverseString("hello");\n}`,
      java: `class Solution {\n    public String reverseString(String s) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.reverseString("hello"));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "olleh", hidden: false },
      { input: "", expectedOutput: "dcba", hidden: true }
    ],
    tags: ["String", "Two Pointers"]
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    examples: [{ input: "x = 121", output: "true" }],
    starterCode: {
      javascript: `function isPalindrome(x) {\n    // Your code here\n}\nconsole.log(isPalindrome(121));`,
      python: `def isPalindrome(x):\n    # Your code here\n    pass\nprint(str(isPalindrome(121)).lower())`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nbool isPalindrome(int x) {\n    // Your code here\n}\nint main(){\n    cout << (isPalindrome(121) ? "true" : "false");\n}`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.isPalindrome(121));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "true", hidden: false },
      { input: "", expectedOutput: "false", hidden: true }
    ],
    tags: ["Math"]
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: ["1 <= s.length <= 10^4"],
    examples: [{ input: 's = "()"', output: "true" }],
    starterCode: {
      javascript: `function isValid(s) {\n    // Your code here\n}\nconsole.log(isValid("()"));`,
      python: `def isValid(s):\n    # Your code here\n    pass\nprint(str(isValid("()")).lower())`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nbool isValid(string s) {\n    // Your code here\n}\nint main(){\n    cout << (isValid("()") ? "true" : "false");\n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.isValid("()"));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "true", hidden: false },
      { input: "", expectedOutput: "true", hidden: true }
    ],
    tags: ["String", "Stack"]
  },
  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    constraints: ["The number of nodes in both lists is in the range [0, 50]"],
    examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }],
    starterCode: {
      javascript: `function mergeTwoLists(l1, l2) {\n    // Your code here\n}\nconsole.log("[1,1,2,3,4,4]");`,
      python: `def mergeTwoLists(l1, l2):\n    # Your code here\n    pass\nprint("[1,1,2,3,4,4]")`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    cout << "[1,1,2,3,4,4]";\n}`,
      java: `class Solution {\n    public static void main(String[] args) {\n        System.out.println("[1,1,2,3,4,4]");\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "[1,1,2,3,4,4]", hidden: false }
    ],
    tags: ["Linked List", "Recursion"]
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
    constraints: ["1 <= nums.length <= 10^5"],
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" }],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n    // Your code here\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));`,
      python: `def maxSubArray(nums):\n    # Your code here\n    pass\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint maxSubArray(vector<int>& nums) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << maxSubArray(nums);\n}`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "6", hidden: false }
    ],
    tags: ["Array", "Dynamic Programming"]
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: ["1 <= n <= 45"],
    examples: [{ input: "n = 3", output: "3" }],
    starterCode: {
      javascript: `function climbStairs(n) {\n    // Your code here\n}\nconsole.log(climbStairs(3));`,
      python: `def climbStairs(n):\n    # Your code here\n    pass\nprint(climbStairs(3))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint climbStairs(int n) {\n    // Your code here\n}\nint main(){\n    cout << climbStairs(3);\n}`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.climbStairs(3));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "3", hidden: false },
      { input: "", expectedOutput: "5", hidden: true }
    ],
    tags: ["Dynamic Programming", "Math"]
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given a sorted array of integers nums and an integer target, return the index of target in nums, or -1 if not found.",
    constraints: ["1 <= nums.length <= 10^4"],
    examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }],
    starterCode: {
      javascript: `function search(nums, target) {\n    // Your code here\n}\nconsole.log(search([-1,0,3,5,9,12], 9));`,
      python: `def search(nums, target):\n    # Your code here\n    pass\nprint(search([-1,0,3,5,9,12], 9))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint search(vector<int>& nums, int target) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {-1,0,3,5,9,12};\n    cout << search(nums, 9);\n}`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.search(new int[]{-1,0,3,5,9,12}, 9));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "4", hidden: false }
    ],
    tags: ["Array", "Binary Search"]
  },
  {
    slug: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    description: "Given an integer n, return a string array answer where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, answer[i] == 'Fizz' if i is divisible by 3, answer[i] == 'Buzz' if i is divisible by 5, answer[i] == i (as a string) otherwise.",
    constraints: ["1 <= n <= 10^4"],
    examples: [{ input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' }],
    starterCode: {
      javascript: `function fizzBuzz(n) {\n    // Your code here\n}\nconsole.log(JSON.stringify(fizzBuzz(5)));`,
      python: `def fizzBuzz(n):\n    # Your code here\n    pass\nimport json\nprint(json.dumps(fizzBuzz(5)))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nvector<string> fizzBuzz(int n) {\n    // Your code here\n}\nint main(){\n    auto result = fizzBuzz(5);\n    cout << "[";\n    for(int i=0; i<result.size(); i++){\n        cout << "\\"" << result[i] << "\\"";\n        if(i < result.size()-1) cout << ",";\n    }\n    cout << "]";\n}`,
      java: `class Solution {\n    public String[] fizzBuzz(int n) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        String[] result = s.fizzBuzz(5);\n        System.out.println(java.util.Arrays.toString(result));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: '["1","2","Fizz","4","Buzz"]', hidden: false }
    ],
    tags: ["Math", "String"]
  },
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    description: "Given a roman numeral, convert it to an integer.",
    constraints: ["1 <= s.length <= 15"],
    examples: [{ input: 's = "III"', output: "3" }],
    starterCode: {
      javascript: `function romanToInt(s) {\n    // Your code here\n}\nconsole.log(romanToInt("III"));`,
      python: `def romanToInt(s):\n    # Your code here\n    pass\nprint(romanToInt("III"))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint romanToInt(string s) {\n    // Your code here\n}\nint main(){\n    cout << romanToInt("III");\n}`,
      java: `class Solution {\n    public int romanToInt(String s) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        System.out.println(sol.romanToInt("III"));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "3", hidden: false }
    ],
    tags: ["Hash Table", "Math", "String"]
  },
  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    description: "Write a function to find the longest common prefix string amongst an array of strings.",
    constraints: ["1 <= strs.length <= 200"],
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"' }],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {\n    // Your code here\n}\nconsole.log(longestCommonPrefix(["flower","flow","flight"]));`,
      python: `def longestCommonPrefix(strs):\n    # Your code here\n    pass\nprint(longestCommonPrefix(["flower","flow","flight"]))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nstring longestCommonPrefix(vector<string>& strs) {\n    // Your code here\n}\nint main(){\n    vector<string> strs = {"flower","flow","flight"};\n    cout << longestCommonPrefix(strs);\n}`,
      java: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.longestCommonPrefix(new String[]{"flower","flow","flight"}));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "fl", hidden: false }
    ],
    tags: ["String"]
  },
  {
    slug: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    constraints: ["1 <= prices.length <= 10^5"],
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }],
    starterCode: {
      javascript: `function maxProfit(prices) {\n    // Your code here\n}\nconsole.log(maxProfit([7,1,5,3,6,4]));`,
      python: `def maxProfit(prices):\n    # Your code here\n    pass\nprint(maxProfit([7,1,5,3,6,4]))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint maxProfit(vector<int>& prices) {\n    // Your code here\n}\nint main(){\n    vector<int> prices = {7,1,5,3,6,4};\n    cout << maxProfit(prices);\n}`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.maxProfit(new int[]{7,1,5,3,6,4}));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "5", hidden: false }
    ],
    tags: ["Array", "Dynamic Programming"]
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    constraints: ["1 <= nums.length <= 10^5"],
    examples: [{ input: "nums = [1,2,3,1]", output: "true" }],
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n    // Your code here\n}\nconsole.log(containsDuplicate([1,2,3,1]));`,
      python: `def containsDuplicate(nums):\n    # Your code here\n    pass\nprint(str(containsDuplicate([1,2,3,1])).lower())`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nbool containsDuplicate(vector<int>& nums) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {1,2,3,1};\n    cout << (containsDuplicate(nums) ? "true" : "false");\n}`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.containsDuplicate(new int[]{1,2,3,1}));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "true", hidden: false }
    ],
    tags: ["Array", "Hash Table"]
  },
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
    constraints: ["1 <= nums.length <= 3 * 10^4"],
    examples: [{ input: "nums = [2,2,1]", output: "1" }],
    starterCode: {
      javascript: `function singleNumber(nums) {\n    // Your code here\n}\nconsole.log(singleNumber([2,2,1]));`,
      python: `def singleNumber(nums):\n    # Your code here\n    pass\nprint(singleNumber([2,2,1]))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nint singleNumber(vector<int>& nums) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {2,2,1};\n    cout << singleNumber(nums);\n}`,
      java: `class Solution {\n    public int singleNumber(int[] nums) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        System.out.println(s.singleNumber(new int[]{2,2,1}));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "1", hidden: false }
    ],
    tags: ["Array", "Bit Manipulation"]
  },
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
    constraints: ["1 <= nums.length <= 10^4"],
    examples: [{ input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" }],
    starterCode: {
      javascript: `function moveZeroes(nums) {\n    // Your code here\n}\nlet arr = [0,1,0,3,12];\nmoveZeroes(arr);\nconsole.log(JSON.stringify(arr));`,
      python: `def moveZeroes(nums):\n    # Your code here\n    pass\nimport json\narr = [0,1,0,3,12]\nmoveZeroes(arr)\nprint(json.dumps(arr))`,
      cpp: `#include<bits/stdc++.h>\nusing namespace std;\nvoid moveZeroes(vector<int>& nums) {\n    // Your code here\n}\nint main(){\n    vector<int> nums = {0,1,0,3,12};\n    moveZeroes(nums);\n    cout << "[";\n    for(int i=0; i<nums.size(); i++){\n        cout << nums[i];\n        if(i < nums.size()-1) cout << ",";\n    }\n    cout << "]";\n}`,
      java: `class Solution {\n    public void moveZeroes(int[] nums) {\n        // Your code here\n    }\n    public static void main(String[] args) {\n        Solution s = new Solution();\n        int[] nums = {0,1,0,3,12};\n        s.moveZeroes(nums);\n        System.out.println(java.util.Arrays.toString(nums));\n    }\n}`
    },
    testCases: [
      { input: "", expectedOutput: "[1,3,12,0,0]", hidden: false }
    ],
    tags: ["Array", "Two Pointers"]
  }
];

async function seed() {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");
    
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");
    
    const inserted = await Problem.insertMany(problems);
    console.log(`✅ Inserted ${inserted.length} problems`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
