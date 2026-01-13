# 🚀 COMPLETE SETUP GUIDE - LeetCode-Style Problem System

## What You Have Now

A fully functional LeetCode-style coding platform with:
- ✅ Database models (Problem, Submission)
- ✅ Backend APIs for problems and submissions
- ✅ Code execution engine (Piston API)
- ✅ Frontend UI (problems list, problem solver)
- ✅ Monaco code editor with syntax highlighting
- ✅ Multi-language support (C++, Python, JavaScript, Java)
- ✅ Test case validation (visible + hidden)
- ✅ Submission tracking and statistics

## 📋 Prerequisites

Make sure you have:
- ✅ MongoDB Atlas or local MongoDB running
- ✅ Node.js installed
- ✅ Backend and frontend dependencies installed

## 🔧 Step-by-Step Setup

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install axios
```

This installs the axios package needed for Piston API calls.

### Step 2: Seed Sample Problems

```powershell
cd backend
npm run seed:problems
```

This will:
- Connect to your MongoDB database
- Clear any existing problems
- Insert 3 sample problems:
  1. Two Sum (Easy)
  2. Reverse String (Easy)
  3. Palindrome Number (Easy)

Expected output:
```
Connected to MongoDB
Cleared existing problems
Inserted 3 problems

Problems seeded successfully!
```

### Step 3: Start Backend Server

```powershell
cd backend
npm run dev
```

Expected output:
```
Server is running on port: 5000
MongoDB connected successfully
```

### Step 4: Start Frontend

Open a NEW PowerShell terminal:

```powershell
cd frontend
npm run dev
```

Expected output:
```
VITE ready in 500ms
Local: http://localhost:5173
```

### Step 5: Test the System

1. **Open browser**: http://localhost:5173
2. **Sign in** with your Clerk account
3. **Navigate to Problems** (click "Problems" in sidebar)
4. **You should see**: 3 problems listed
5. **Click on any problem** to open the solver
6. **Write code** in the editor
7. **Click Run** to test visible cases
8. **Click Submit** to evaluate all cases

## 🎯 What Each File Does

### Backend Files Created

| File | Purpose |
|------|---------|
| `models/Problem.js` | MongoDB schema for problems |
| `models/Submission.js` | MongoDB schema for submissions |
| `controllers/problemController.js` | API logic for CRUD operations |
| `routes/problemRoutes.js` | API endpoints |
| `lib/codeExecutor.js` | Code execution via Piston API |
| `scripts/seedProblems.js` | Database seeding script |

### Frontend Files Modified

| File | Changes |
|------|---------|
| `pages/ProblemsPage.jsx` | Fetches from API instead of local data |
| `pages/ProblemPage.jsx` | Uses slug, calls backend APIs |
| `components/ProblemDescription.jsx` | Simplified for API data |
| `components/CodeEditorPanel.jsx` | Added Submit button |
| `components/OutputPanel.jsx` | Shows test case results |
| `App.jsx` | Changed route from `:id` to `:slug` |

### Backend Routes Added

```javascript
// server.js
app.use("/api/problems", problemRoutes);
```

## 🧪 Testing the Flow

### Test 1: View Problems List

**Action**: Navigate to /problems

**Expected**: 
- See 3 problems
- Stats show: 3 Total, 3 Easy, 0 Medium, 0 Hard
- Each problem has title, difficulty badge, acceptance rate

### Test 2: Solve Two Sum

**Action**: Click on "Two Sum" problem

**Expected**:
- Left panel: Problem description, examples, constraints
- Right panel: Code editor with starter code
- Bottom: Empty output panel

**Action**: Click "Run"

**Expected**:
- See "2 / 2 Passed" (only visible test cases)
- Green success indicators
- Test case details shown

**Action**: Click "Submit"

**Expected**:
- See "4 / 4 Passed" (all test cases including hidden)
- Confetti animation 🎉
- "Accepted!" toast message
- Submission saved to database

### Test 3: Wrong Answer

**Action**: Write intentionally wrong code
```javascript
function twoSum(nums, target) {
    return [0, 0]; // Always wrong
}
```

**Action**: Click "Submit"

**Expected**:
- See "0 / 4 Passed"
- Red error indicators
- Shows expected vs actual output
- Status: "Wrong Answer"

### Test 4: Runtime Error

**Action**: Write code that throws error
```javascript
function twoSum(nums, target) {
    throw new Error("Test error");
}
```

**Action**: Click "Submit"

**Expected**:
- Status: "Runtime Error"
- Error message displayed
- Red indicators

## 🔍 API Testing (Optional)

You can test APIs directly using curl or Postman:

### Get all problems
```powershell
curl http://localhost:5000/api/problems
```

### Get specific problem
```powershell
curl http://localhost:5000/api/problems/two-sum
```

### Run code
```powershell
curl -X POST http://localhost:5000/api/problems/two-sum/run `
-H "Content-Type: application/json" `
-d '{\"code\":\"function twoSum(nums, target) { return [0,1]; } const nums = [2,7,11,15]; const target = 9; console.log(JSON.stringify(twoSum(nums, target)));\",\"language\":\"javascript\"}'
```

## 🐛 Troubleshooting

### Problem: "No problems found"

**Solution**: Run the seed script
```powershell
cd backend
npm run seed:problems
```

### Problem: "Failed to load problem"

**Causes**:
1. Backend not running
2. MongoDB not connected
3. Wrong API baseURL

**Solution**:
```powershell
# Check backend is running
cd backend
npm run dev

# Check MongoDB connection in terminal
```

### Problem: "Failed to run code"

**Causes**:
1. Piston API is down
2. Network issues
3. Invalid code syntax

**Solution**:
- Check internet connection
- Try again in a few seconds
- Check browser console for errors

### Problem: Route changes not working

**Solution**: Clear browser cache or hard refresh (Ctrl+Shift+R)

### Problem: Axios not installed error

**Solution**:
```powershell
cd backend
npm install axios
```

## 📊 Database Verification

Check your MongoDB to verify data:

```javascript
// In MongoDB Compass or shell
use your_database_name

// View problems
db.problems.find().pretty()

// View submissions
db.submissions.find().pretty()

// Count problems
db.problems.count()
```

## 🎨 Customization

### Adding More Problems

Edit `backend/src/scripts/seedProblems.js`:

```javascript
const sampleProblems = [
  // ... existing problems
  {
    slug: "your-problem-slug",
    title: "Your Problem Title",
    difficulty: "Medium",
    description: "...",
    // ... rest of structure
  }
];
```

Then run:
```powershell
npm run seed:problems
```

### Changing Language Versions

Edit `backend/src/lib/codeExecutor.js`:

```javascript
const LANGUAGE_CONFIG = {
  cpp: { language: "cpp", version: "10.2.0", extension: "cpp" },
  // Change version numbers here
};
```

### Adjusting Timeouts

Edit `backend/src/lib/codeExecutor.js`:

```javascript
compile_timeout: 10000,  // 10 seconds
run_timeout: 5000,       // 5 seconds
```

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] 3 problems seeded
- [ ] Can view problems list
- [ ] Can click and open a problem
- [ ] Code editor loads
- [ ] Can Run code
- [ ] Can Submit code
- [ ] Test results display correctly

## 🎯 Next Steps

Now that your system is working:

1. **Test thoroughly** with different problems
2. **Add more problems** to the database
3. **Customize styling** if needed
4. **Monitor submissions** in MongoDB
5. **Test all 4 languages** (C++, Python, JS, Java)

## 📚 Key Differences from Old System

| Old System | New System |
|------------|------------|
| Local problems.js file | MongoDB database |
| No backend validation | Full API with test cases |
| Simple output check | Comprehensive test case system |
| No hidden tests | Hidden test cases included |
| No submission history | Full submission tracking |
| Fixed problems | Scalable problem management |

## 🚨 Important Notes

1. **Hidden test cases** only run on Submit, not Run
2. **Authentication is optional** for running/submitting code
3. **Submissions are only saved** if user is authenticated
4. **Piston API** is free but has rate limits
5. **All test cases run sequentially**, not in parallel

## 🎉 You're Done!

Your LeetCode-style problem system is now fully operational!

**Access it at**: http://localhost:5173/problems

Have fun coding! 💻✨
