import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { ENV } from "../lib/env.js";

const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists"],
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], hidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], hidden: false },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], hidden: true },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expectedOutput: [2, 4], hidden: true },
      { input: { nums: [1, 5, 3, 7, 9], target: 12 }, expectedOutput: [1, 3], hidden: true },
    ],
    functionSignature: { functionName: "twoSum", returnType: "int[]", parameters: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
      javascript: `var twoSum = function(nums, target) {\n    \n};`,
    },
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    testCases: [
      { input: { s: ["h", "e", "l", "l", "o"] }, expectedOutput: ["o", "l", "l", "e", "h"], hidden: false },
      { input: { s: ["H", "a", "n", "n", "a", "h"] }, expectedOutput: ["h", "a", "n", "n", "a", "H"], hidden: false },
      { input: { s: ["A"] }, expectedOutput: ["A"], hidden: true },
      { input: { s: ["a", "b"] }, expectedOutput: ["b", "a"], hidden: true },
      { input: { s: ["t", "e", "s", "t"] }, expectedOutput: ["t", "s", "e", "t"], hidden: true },
    ],
    functionSignature: { functionName: "reverseString", returnType: "void", parameters: [{ name: "s", type: "char[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};`,
      c: `void reverseString(char* s, int sSize) {\n    \n}`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n        \n    }\n}`,
      python: `class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        pass`,
      javascript: `var reverseString = function(s) {\n    \n};`,
    },
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
    constraints: ["-2³¹ ≤ x ≤ 2³¹ - 1"],
    examples: [
      { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-." },
    ],
    testCases: [
      { input: { x: 121 }, expectedOutput: true, hidden: false },
      { input: { x: -121 }, expectedOutput: false, hidden: false },
      { input: { x: 10 }, expectedOutput: false, hidden: true },
      { input: { x: 0 }, expectedOutput: true, hidden: true },
      { input: { x: 12321 }, expectedOutput: true, hidden: true },
    ],
    functionSignature: { functionName: "isPalindrome", returnType: "bool", parameters: [{ name: "x", type: "int" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};`,
      c: `bool isPalindrome(int x) {\n    \n}`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}`,
      python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass`,
      javascript: `var isPalindrome = function(x) {\n    \n};`,
    },
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
    ],
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expectedOutput: 6, hidden: false },
      { input: { nums: [1] }, expectedOutput: 1, hidden: false },
      { input: { nums: [5, 4, -1, 7, 8] }, expectedOutput: 23, hidden: true },
      { input: { nums: [-1] }, expectedOutput: -1, hidden: true },
      { input: { nums: [-2, -1] }, expectedOutput: -1, hidden: true },
    ],
    functionSignature: { functionName: "maxSubArray", returnType: "int", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};`,
      c: `int maxSubArray(int* nums, int numsSize) {\n    \n}`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}`,
      python: `class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass`,
      javascript: `var maxSubArray = function(nums) {\n    \n};`,
    },
  },
  {
    slug: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    description: 'Given an integer `n`, return a string array `answer` where:\n- `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5\n- `answer[i] == "Fizz"` if `i` is divisible by 3\n- `answer[i] == "Buzz"` if `i` is divisible by 5\n- `answer[i] == i` otherwise',
    constraints: ["1 ≤ n ≤ 10⁴"],
    examples: [
      { input: "n = 3", output: '["1","2","Fizz"]' },
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
    ],
    testCases: [
      { input: { n: 3 }, expectedOutput: ["1", "2", "Fizz"], hidden: false },
      { input: { n: 5 }, expectedOutput: ["1", "2", "Fizz", "4", "Buzz"], hidden: false },
      { input: { n: 15 }, expectedOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"], hidden: true },
      { input: { n: 1 }, expectedOutput: ["1"], hidden: true },
      { input: { n: 10 }, expectedOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz"], hidden: true },
    ],
    functionSignature: { functionName: "fizzBuzz", returnType: "string[]", parameters: [{ name: "n", type: "int" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};`,
      c: `char** fizzBuzz(int n, int* returnSize) {\n    \n}`,
      java: `class Solution {\n    public List<String> fizzBuzz(int n) {\n        \n    }\n}`,
      python: `class Solution:\n    def fizzBuzz(self, n: int) -> List[str]:\n        pass`,
      javascript: `var fizzBuzz = function(n) {\n    \n};`,
    },
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type\n2. Open brackets must be closed in the correct order\n3. Every close bracket has a corresponding open bracket",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
    ],
    testCases: [
      { input: { s: "()" }, expectedOutput: true, hidden: false },
      { input: { s: "()[]{}" }, expectedOutput: true, hidden: false },
      { input: { s: "(]" }, expectedOutput: false, hidden: true },
      { input: { s: "([)]" }, expectedOutput: false, hidden: true },
      { input: { s: "{[]}" }, expectedOutput: true, hidden: true },
    ],
    functionSignature: { functionName: "isValid", returnType: "bool", parameters: [{ name: "s", type: "string" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`,
      c: `bool isValid(char* s) {\n    \n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`,
      javascript: `var isValid = function(s) {\n    \n};`,
    },
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit. If you cannot achieve any profit, return `0`.",
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 5, hidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0, hidden: false },
      { input: { prices: [1, 2] }, expectedOutput: 1, hidden: true },
      { input: { prices: [2, 4, 1] }, expectedOutput: 2, hidden: true },
      { input: { prices: [3, 3, 5, 0, 0, 3, 1, 4] }, expectedOutput: 4, hidden: true },
    ],
    functionSignature: { functionName: "maxProfit", returnType: "int", parameters: [{ name: "prices", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};`,
      c: `int maxProfit(int* prices, int pricesSize) {\n    \n}`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}`,
      python: `class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass`,
      javascript: `var maxProfit = function(prices) {\n    \n};`,
    },
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true, hidden: false },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false, hidden: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expectedOutput: true, hidden: true },
      { input: { nums: [1] }, expectedOutput: false, hidden: true },
      { input: { nums: [1, 5, -2, -4, 0] }, expectedOutput: false, hidden: true },
    ],
    functionSignature: { functionName: "containsDuplicate", returnType: "bool", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};`,
      c: `bool containsDuplicate(int* nums, int numsSize) {\n    \n}`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}`,
      python: `class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass`,
      javascript: `var containsDuplicate = function(nums) {\n    \n};`,
    },
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All integers in nums are unique", "nums is sorted in ascending order"],
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4, hidden: false },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1, hidden: false },
      { input: { nums: [5], target: 5 }, expectedOutput: 0, hidden: true },
      { input: { nums: [2, 5], target: 5 }, expectedOutput: 1, hidden: true },
      { input: { nums: [1, 2, 3, 4, 5, 6, 7], target: 1 }, expectedOutput: 0, hidden: true },
    ],
    functionSignature: { functionName: "search", returnType: "int", parameters: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};`,
      c: `int search(int* nums, int numsSize, int target) {\n    \n}`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}`,
      python: `class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass`,
      javascript: `var search = function(nums, target) {\n    \n};`,
    },
  },
  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    constraints: ["The number of nodes in both lists is in the range [0, 50]", "-100 ≤ Node.val ≤ 100", "Both lists are sorted in non-decreasing order"],
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
    ],
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4], hidden: false },
      { input: { list1: [], list2: [] }, expectedOutput: [], hidden: false },
      { input: { list1: [], list2: [0] }, expectedOutput: [0], hidden: true },
      { input: { list1: [1], list2: [2] }, expectedOutput: [1, 2], hidden: true },
      { input: { list1: [5], list2: [1, 2, 4] }, expectedOutput: [1, 2, 4, 5], hidden: true },
    ],
    functionSignature: { functionName: "mergeTwoLists", returnType: "ListNode", parameters: [{ name: "list1", type: "ListNode" }, { name: "list2", type: "ListNode" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};`,
      c: `struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    \n}`,
      java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}`,
      python: `class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass`,
      javascript: `var mergeTwoLists = function(list1, list2) {\n    \n};`,
    },
  },
  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
    constraints: ["The number of nodes in the list is in the range [0, 10⁴]", "-10⁵ ≤ Node.val ≤ 10⁵"],
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true" },
      { input: "head = [1], pos = -1", output: "false" },
    ],
    testCases: [
      { input: { head: [3, 2, 0, -4], pos: 1 }, expectedOutput: true, hidden: false },
      { input: { head: [1], pos: -1 }, expectedOutput: false, hidden: false },
      { input: { head: [1, 2], pos: 0 }, expectedOutput: true, hidden: true },
      { input: { head: [], pos: -1 }, expectedOutput: false, hidden: true },
      { input: { head: [1, 2, 3, 4, 5], pos: 2 }, expectedOutput: true, hidden: true },
    ],
    functionSignature: { functionName: "hasCycle", returnType: "bool", parameters: [{ name: "head", type: "ListNode" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        \n    }\n};`,
      c: `bool hasCycle(struct ListNode *head) {\n    \n}`,
      java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        \n    }\n}`,
      python: `class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass`,
      javascript: `var hasCycle = function(head) {\n    \n};`,
    },
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    description: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements in `nums`.",
    constraints: ["1 ≤ nums.length ≤ 3 * 10⁴", "-100 ≤ nums[i] ≤ 100", "nums is sorted in non-decreasing order"],
    examples: [
      { input: "nums = [1,1,2]", output: "2, nums = [1,2,_]" },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums = [0,1,2,3,4]" },
    ],
    testCases: [
      { input: { nums: [1, 1, 2] }, expectedOutput: 2, hidden: false },
      { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expectedOutput: 5, hidden: false },
      { input: { nums: [1, 2, 3] }, expectedOutput: 3, hidden: true },
      { input: { nums: [1, 1, 1, 1] }, expectedOutput: 1, hidden: true },
      { input: { nums: [1] }, expectedOutput: 1, hidden: true },
    ],
    functionSignature: { functionName: "removeDuplicates", returnType: "int", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        \n    }\n};`,
      c: `int removeDuplicates(int* nums, int numsSize) {\n    \n}`,
      java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        \n    }\n}`,
      python: `class Solution:\n    def removeDuplicates(self, nums: List[int]) -> int:\n        pass`,
      javascript: `var removeDuplicates = function(nums) {\n    \n};`,
    },
  },
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with linear runtime complexity and use only constant extra space.",
    constraints: ["1 ≤ nums.length ≤ 3 * 10⁴", "-3 * 10⁴ ≤ nums[i] ≤ 3 * 10⁴", "Each element appears twice except for one"],
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
    ],
    testCases: [
      { input: { nums: [2, 2, 1] }, expectedOutput: 1, hidden: false },
      { input: { nums: [4, 1, 2, 1, 2] }, expectedOutput: 4, hidden: false },
      { input: { nums: [1] }, expectedOutput: 1, hidden: true },
      { input: { nums: [1, 3, 1, -1, 3] }, expectedOutput: -1, hidden: true },
      { input: { nums: [7, 3, 5, 5, 3] }, expectedOutput: 7, hidden: true },
    ],
    functionSignature: { functionName: "singleNumber", returnType: "int", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        \n    }\n};`,
      c: `int singleNumber(int* nums, int numsSize) {\n    \n}`,
      java: `class Solution {\n    public int singleNumber(int[] nums) {\n        \n    }\n}`,
      python: `class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        pass`,
      javascript: `var singleNumber = function(nums) {\n    \n};`,
    },
  },
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    constraints: ["The number of nodes in the list is [0, 5000]", "-5000 ≤ Node.val ≤ 5000"],
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = []", output: "[]" },
    ],
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1], hidden: false },
      { input: { head: [] }, expectedOutput: [], hidden: false },
      { input: { head: [1] }, expectedOutput: [1], hidden: true },
      { input: { head: [1, 2] }, expectedOutput: [2, 1], hidden: true },
      { input: { head: [1, 2, 3] }, expectedOutput: [3, 2, 1], hidden: true },
    ],
    functionSignature: { functionName: "reverseList", returnType: "ListNode", parameters: [{ name: "head", type: "ListNode" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};`,
      c: `struct ListNode* reverseList(struct ListNode* head) {\n    \n}`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass`,
      javascript: `var reverseList = function(head) {\n    \n};`,
    },
  },
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote: You must do this in-place without making a copy of the array.",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ - 1"],
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    testCases: [
      { input: { nums: [0, 1, 0, 3, 12] }, expectedOutput: [1, 3, 12, 0, 0], hidden: false },
      { input: { nums: [0] }, expectedOutput: [0], hidden: false },
      { input: { nums: [1, 2, 3] }, expectedOutput: [1, 2, 3], hidden: true },
      { input: { nums: [0, 0, 1] }, expectedOutput: [1, 0, 0], hidden: true },
      { input: { nums: [2, 1] }, expectedOutput: [2, 1], hidden: true },
    ],
    functionSignature: { functionName: "moveZeroes", returnType: "void", parameters: [{ name: "nums", type: "int[]" }] },
    starterCode: {
      cpp: `class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};`,
      c: `void moveZeroes(int* nums, int numsSize) {\n    \n}`,
      java: `class Solution {\n    public void moveZeroes(int[] nums) {\n        \n    }\n}`,
      python: `class Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        pass`,
      javascript: `var moveZeroes = function(nums) {\n    \n};`,
    },
  },
];

const seedProblems = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB\n");
    await Problem.insertMany(problems);
    console.log(`✨ Successfully seeded ${problems.length} problems!`);
    console.log("\n" + "=".repeat(60));
    console.log("📊 Problems Summary:");
    console.log("=".repeat(60));
    problems.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.title} (${p.difficulty}) - ${p.slug}`);
    });
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error seeding problems:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
    process.exit(0);
  }
};

seedProblems();
