# LeetCode-Style Problem System

## Overview

This is a fully functional LeetCode-style coding problem system with:
- 🎯 Problem submission and execution
- 📊 Real-time test case validation
- 💻 Multi-language support (C++, Python, JavaScript, Java)
- 🔒 Hidden test cases for comprehensive evaluation
- 📈 Submission tracking and statistics

## System Architecture

### Backend Structure

```
backend/
├── models/
│   ├── Problem.js        # Problem schema with test cases
│   ├── Submission.js     # User submission history
│   └── User.js          # User model
├── controllers/
│   └── problemController.js  # Problem and submission logic
├── lib/
│   └── codeExecutor.js  # Code execution engine (Piston API)
├── routes/
│   └── problemRoutes.js # API endpoints
└── scripts/
    └── seedProblems.js  # Database seeding script
```

### Frontend Structure

```
frontend/
├── pages/
│   ├── ProblemsPage.jsx   # Problems list view
│   └── ProblemPage.jsx    # Individual problem solver
└── components/
    ├── ProblemDescription.jsx  # Problem details
    ├── CodeEditorPanel.jsx     # Monaco code editor
    └── OutputPanel.jsx         # Test results display
```

## API Endpoints

### Public Endpoints

- `GET /api/problems` - List all problems with filters
  - Query params: `difficulty`, `tags`, `page`, `limit`
  
- `GET /api/problems/:slug` - Get problem details
  - Returns: problem data with visible test cases only

### Execution Endpoints

- `POST /api/problems/:slug/run` - Run code against visible test cases
  - Body: `{ code, language }`
  - Returns: test results for visible cases only
  
- `POST /api/problems/:slug/submit` - Submit code for evaluation
  - Body: `{ code, language }`
  - Runs ALL test cases (including hidden)
  - Saves submission to database if authenticated
  - Returns: final verdict and statistics

### Protected Endpoints

- `GET /api/problems/:slug/submissions` - Get user's submission history
  - Requires authentication

## Database Models

### Problem Model

```javascript
{
  slug: String (unique),
  title: String,
  difficulty: "Easy" | "Medium" | "Hard",
  description: String,
  constraints: [String],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  starterCode: {
    cpp: String,
    python: String,
    javascript: String,
    java: String
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    hidden: Boolean
  }],
  tags: [String],
  acceptanceRate: Number,
  totalSubmissions: Number,
  totalAccepted: Number
}
```

### Submission Model

```javascript
{
  userId: ObjectId,
  problemId: ObjectId,
  problemSlug: String,
  code: String,
  language: String,
  status: "Accepted" | "Wrong Answer" | "TLE" | "Runtime Error" | "Compilation Error",
  runtime: Number,
  testCasesPassed: Number,
  totalTestCases: Number,
  errorMessage: String
}
```

## Code Execution Flow

1. **User submits code** → Frontend sends to backend
2. **Backend validates** → Checks problem exists
3. **Fetch test cases** → 
   - `Run`: Only visible test cases
   - `Submit`: ALL test cases (visible + hidden)
4. **Execute code** → Uses Piston API for sandboxed execution
5. **Compare outputs** → Match actual vs expected (trimmed & normalized)
6. **Return verdict** → 
   - Accepted ✅
   - Wrong Answer ❌
   - Runtime Error 💥
   - Time Limit Exceeded ⏱️
   - Compilation Error 🔧
7. **Update stats** → Increment submission count, acceptance rate
8. **Save submission** → Store in database (if authenticated)

## Setup Instructions

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Environment Variables

Ensure your `.env` file has:
```
MONGODB_URI=your_mongodb_connection_string
```

### 3. Seed Initial Problems

```bash
cd backend
npm run seed:problems
```

This will populate your database with sample problems (Two Sum, Reverse String, Palindrome Number).

### 4. Start Services

```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)  
npm run dev
```

## Language Support

### JavaScript (Node.js 18.15.0)
- Execution via Node.js runtime
- Supports ES6+ features
- JSON output for results

### Python (3.10.0)
- Standard Python 3 interpreter
- Full standard library access
- JSON serialization for outputs

### C++ (g++ 10.2.0)
- Modern C++ standards
- STL library support
- Compiled and executed

### Java (OpenJDK 15.0.2)
- Standard Java runtime
- Full JDK features
- Class-based execution

## Test Case System

### Visible Test Cases
- Shown to users in problem description
- Used during "Run" operation
- Help users debug their solutions

### Hidden Test Cases
- Not visible to users
- Only used during "Submit" operation
- Prevent hardcoded solutions
- Ensure comprehensive correctness

## Security & Isolation

- All code execution happens in **sandboxed environment** (Piston API)
- Time limits enforced (5 seconds per test case)
- Memory limits enforced
- No file system access
- No network access
- Isolated per execution

## Features

### ✅ Implemented
- [x] Multi-language code editor (Monaco)
- [x] Real-time code execution
- [x] Test case validation
- [x] Hidden test cases
- [x] Submission history
- [x] Problem difficulty filters
- [x] Acceptance rate tracking
- [x] Runtime measurements
- [x] Error handling and display
- [x] Responsive UI

### 🚀 Standalone System
This problem system is **completely independent** from:
- Collaborative coding sessions
- Live video sessions
- Partner invitations
- Session history

It's a pure LeetCode-style problem-solving platform.

## Usage

### For Users
1. Navigate to **Problems** in sidebar
2. Browse problems by difficulty
3. Click on a problem to solve
4. Write solution in code editor
5. Click **Run** to test against visible cases
6. Click **Submit** to evaluate against all cases
7. View detailed test results

### For Admins (Adding Problems)
1. Use the Problem model structure
2. Add problems via database insert or seed script
3. Include visible and hidden test cases
4. Provide starter code for all 4 languages
5. Test thoroughly before deployment

## Troubleshooting

### Code Execution Issues
- Check Piston API availability
- Verify network connectivity
- Check timeout settings

### Database Issues
- Ensure MongoDB connection
- Run seed script if no problems appear
- Check model schemas match

### Frontend Issues
- Clear browser cache
- Check axios baseURL configuration
- Verify route parameters match

## Performance Considerations

- Test case execution is sequential (not parallel)
- Average execution time: 200-500ms per test case
- Piston API has rate limits
- Consider caching for frequently accessed problems

## Future Enhancements

- [ ] More programming languages (Rust, Go, etc.)
- [ ] Custom test case input
- [ ] Solution discussion (optional)
- [ ] Company tags
- [ ] Premium problems
- [ ] Daily challenges
- [ ] Leaderboards
- [ ] Code templates
- [ ] Solution hints

---

**Built with:** React, Express, MongoDB, Piston API, Monaco Editor
