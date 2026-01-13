import mongoose from "mongoose";
import Problem from "../models/Problem.js";
import { ENV } from "../lib/env.js";

const sampleProblems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
}

// Test
const nums = process.argv[2] ? JSON.parse(process.argv[2]) : [2, 7, 11, 15];
const target = process.argv[3] ? parseInt(process.argv[3]) : 9;
console.log(JSON.stringify(twoSum(nums, target)));`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass

# Test
import sys
import json
nums = json.loads(sys.argv[1]) if len(sys.argv) > 1 else [2, 7, 11, 15]
target = int(sys.argv[2]) if len(sys.argv) > 2 else 9
print(json.dumps(two_sum(nums, target)))`,
      cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`,
    },
    testCases: [
      {
        input: '["[2,7,11,15]","9"]',
        expectedOutput: "[0,1]",
        hidden: false,
      },
      {
        input: '["[3,2,4]","6"]',
        expectedOutput: "[1,2]",
        hidden: false,
      },
      {
        input: '["[3,3]","6"]',
        expectedOutput: "[0,1]",
        hidden: false,
      },
      {
        input: '["[-1,-2,-3,-4,-5]","-8"]',
        expectedOutput: "[2,4]",
        hidden: true,
      },
    ],
    tags: ["Array", "Hash Table"],
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Write your code here
}

// Test
const s = process.argv[2] ? JSON.parse(process.argv[2]) : ["h","e","l","l","o"];
reverseString(s);
console.log(JSON.stringify(s));`,
      python: `def reverse_string(s):
    # Write your code here
    pass

# Test
import sys
import json
s = json.loads(sys.argv[1]) if len(sys.argv) > 1 else ["h","e","l","l","o"]
reverse_string(s)
print(json.dumps(s))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your code here
}

int main() {
    vector<char> s = {'h','e','l','l','o'};
    reverseString(s);
    for(char c : s) cout << c;
    cout << endl;
    return 0;
}`,
      java: `class Solution {
    public static void reverseString(char[] s) {
        // Write your code here
    }
    
    public static void main(String[] args) {
        char[] s = {'h','e','l','l','o'};
        reverseString(s);
        System.out.println(s);
    }
}`,
    },
    testCases: [
      {
        input: '[["h","e","l","l","o"]]',
        expectedOutput: '["o","l","l","e","h"]',
        hidden: false,
      },
      {
        input: '[["H","a","n","n","a","h"]]',
        expectedOutput: '["h","a","n","n","a","H"]',
        hidden: false,
      },
    ],
    tags: ["String", "Two Pointers"],
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description:
      "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome.",
      },
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Write your code here
}

// Test
const x = process.argv[2] ? parseInt(process.argv[2]) : 121;
console.log(isPalindrome(x));`,
      python: `def is_palindrome(x):
    # Write your code here
    pass

# Test
import sys
x = int(sys.argv[1]) if len(sys.argv) > 1 else 121
print(str(is_palindrome(x)).lower())`,
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Write your code here
}

int main() {
    int x = 121;
    cout << (isPalindrome(x) ? "true" : "false") << endl;
    return 0;
}`,
      java: `class Solution {
    public static boolean isPalindrome(int x) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        int x = 121;
        System.out.println(isPalindrome(x));
    }
}`,
    },
    testCases: [
      {
        input: "121",
        expectedOutput: "true",
        hidden: false,
      },
      {
        input: "-121",
        expectedOutput: "false",
        hidden: false,
      },
      {
        input: "10",
        expectedOutput: "false",
        hidden: false,
      },
      {
        input: "12321",
        expectedOutput: "true",
        hidden: true,
      },
    ],
    tags: ["Math"],
  },
];

async function seedProblems() {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert sample problems
    const inserted = await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${inserted.length} problems`);

    console.log("\nProblems seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding problems:", error);
    process.exit(1);
  }
}

seedProblems();
