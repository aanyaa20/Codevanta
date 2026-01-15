import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  Loader2,
  ArrowLeft,
  Play,
  Upload,
  Check,
  X,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Code2,
} from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import Editor from "@monaco-editor/react";
import { useUser, UserButton } from "@clerk/clerk-react";
import SubmissionsPanel from "../components/SubmissionsPanel";

function ProblemPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [submissions, setSubmissions] = useState([]);
  const [expandedExample, setExpandedExample] = useState(-1); // -1 means all collapsed

  // Language configuration
  const LANGUAGE_CONFIG = {
    cpp: { label: "C++", monacoLang: "cpp", extension: ".cpp" },
    c: { label: "C", monacoLang: "c", extension: ".c" },
    java: { label: "Java", monacoLang: "java", extension: ".java" },
    python: { label: "Python", monacoLang: "python", extension: ".py" },
    javascript: { label: "JavaScript", monacoLang: "javascript", extension: ".js" },
  };

  useEffect(() => {
    if (slug) {
      fetchProblem();
      fetchSubmissions();
    }
  }, [slug]);

  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[selectedLanguage]) {
      setCode(problem.starterCode[selectedLanguage]);
    }
  }, [selectedLanguage, problem]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/problems/${slug}`);
      const fetchedProblem = response.data.problem;
      setProblem(fetchedProblem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to load problem");
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axiosInstance.get(`/problems/${slug}/submissions`);
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.log("Not authenticated or no submissions");
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    try {
      setIsRunning(true);
      setOutput(null);

      const response = await axiosInstance.post(`/problems/${slug}/run`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;
      setOutput(result);

      if (result.status === "Accepted") {
        toast.success(`All ${result.passedCount} test cases passed!`);
      } else {
        toast.error(`Test failed: ${result.status}`);
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast.error(error.response?.data?.message || "Failed to run code");
      setOutput({
        status: "Error",
        errorMessage: error.response?.data?.message || "Failed to run code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    try {
      setIsSubmitting(true);
      setOutput(null);

      const response = await axiosInstance.post(`/problems/${slug}/submit`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;
      setOutput(result);

      if (result.status === "Accepted") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("🎉 Accepted! All test cases passed!");
        fetchSubmissions(); // Refresh submissions
      } else {
        toast.error(`Submission failed: ${result.status}`);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error(error.response?.data?.message || "Failed to submit code");
      setOutput({
        status: "Error",
        errorMessage: error.response?.data?.message || "Failed to submit code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "Wrong Answer":
        return "text-red-600 bg-red-50 border-red-200";
      case "Time Limit Exceeded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Runtime Error":
      case "Compilation Error":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Problem not found</h2>
          <button
            onClick={() => navigate("/problems")}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navbar - LeetCode-like */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          {/* Logo/Brand - Clickable */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="size-5 text-white" />
            </div>
            
          </button>

          {/* Back to Problems Button */}
          <button
            onClick={() => navigate("/problems")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-4" />
            Problem List
          </button>
        </div>

        {/* Center - Run & Submit */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg transition-colors shadow-sm"
          >
            {isRunning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Submit
          </button>
        </div>

        {/* Right - Profile Icon */}
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9 rounded-full",
              },
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem Description */}
          <Panel defaultSize={40} minSize={30} maxSize={60}>
            <div className="h-full flex flex-col bg-white border-r border-slate-200">
              {/* Problem Title & Difficulty */}
              <div className="px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getDifficultyBadgeClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200 bg-slate-50">
                <div className="flex px-5">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === "description"
                        ? "text-slate-900 bg-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Description
                    {activeTab === "description" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === "submissions"
                        ? "text-slate-900 bg-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Submissions
                    {activeTab === "submissions" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {activeTab === "description" && (
                  <div className="prose prose-slate max-w-none">
                    {/* Description */}
                    <div className="mb-6">
                      <div
                        className="text-slate-700 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: problem.description.replace(/`([^`]+)`/g, "<code>$1</code>"),
                        }}
                      />
                    </div>

                    {/* Examples */}
                    {problem.examples && problem.examples.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Examples</h3>
                        {problem.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                          >
                            <button
                              onClick={() =>
                                setExpandedExample(expandedExample === idx ? -1 : idx)
                              }
                              className="w-full flex items-center justify-between text-left"
                            >
                              <span className="font-semibold text-slate-900">
                                Example {idx + 1}
                              </span>
                              {expandedExample === idx ? (
                                <ChevronDown className="size-5 text-slate-400" />
                              ) : (
                                <ChevronRight className="size-5 text-slate-400" />
                              )}
                            </button>

                            {expandedExample === idx && (
                              <div className="mt-3 space-y-2 text-sm">
                                <div>
                                  <strong className="text-slate-700">Input:</strong>
                                  <pre className="mt-1 p-2 bg-white border border-slate-200 rounded text-xs overflow-x-auto">
                                    {example.input}
                                  </pre>
                                </div>
                                <div>
                                  <strong className="text-slate-700">Output:</strong>
                                  <pre className="mt-1 p-2 bg-white border border-slate-200 rounded text-xs overflow-x-auto">
                                    {example.output}
                                  </pre>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <strong className="text-slate-700">Explanation:</strong>
                                    <p className="mt-1 text-slate-600">{example.explanation}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Constraints */}
                    {problem.constraints && problem.constraints.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-3">Constraints</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          {problem.constraints.map((constraint, idx) => (
                            <li key={idx}>{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "submissions" && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Your Submissions</h3>
                    <SubmissionsPanel 
                      submissions={submissions} 
                      isLoading={loadingSubmissions} 
                    />
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-slate-100 hover:bg-slate-200 transition-colors" />

          {/* Right Panel - Code Editor */}
          <Panel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col bg-white">
              {/* Language Selector */}
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Code Editor & Output - Vertically Resizable */}
              <PanelGroup direction="vertical">
                <Panel defaultSize={70} minSize={40} maxSize={85}>
                  <Editor
                    height="100%"
                    language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </Panel>
                
                <PanelResizeHandle className="h-2 bg-slate-200 hover:bg-orange-500 transition-colors cursor-row-resize" />

                {/* Test Cases & Output - Resizable */}
                <Panel defaultSize={30} minSize={15} maxSize={60}>
                  <div className="h-full border-t border-slate-200 bg-slate-50 overflow-y-auto p-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Output</h4>

                    {!output && (
                      <div className="text-sm text-slate-500">
                        Run your code or submit to see results here
                      </div>
                    )}

                    {output && (
                      <div className="space-y-3">
                        {/* Status */}
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold ${getStatusColor(
                            output.status
                          )}`}
                        >
                          {output.status === "Accepted" ? (
                            <Check className="size-5" />
                          ) : (
                            <X className="size-5" />
                          )}
                          {output.status}
                        </div>

                        {/* Test Cases Summary */}
                        {output.passedCount !== undefined && (
                          <div className="text-sm">
                            <span className="font-medium text-slate-900">Test Cases:</span>{" "}
                            <span className="text-slate-700">
                              {output.passedCount} / {output.totalCount} passed
                            </span>
                          </div>
                        )}

                        {/* Compilation Error or Runtime Error */}
                        {output.errorMessage && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-xs font-semibold text-red-900 mb-1">Error:</div>
                            <pre className="text-xs text-red-800 whitespace-pre-wrap font-mono">
                              {output.errorMessage}
                            </pre>
                          </div>
                        )}

                        {/* Individual Test Case Results */}
                        {output.testCaseResults && output.testCaseResults.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-slate-900 mb-2">
                              Test Case Results:
                            </div>
                            {output.testCaseResults.map((testResult, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  testResult.passed
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {testResult.passed ? (
                                    <Check className="size-4 text-green-600" />
                                  ) : (
                                    <X className="size-4 text-red-600" />
                                  )}
                                  <span className="text-xs font-semibold text-slate-900">
                                    Test Case #{index + 1}
                                  </span>
                                </div>
                                
                                {/* Input */}
                                <div className="mb-2">
                                  <div className="text-xs font-semibold text-slate-700 mb-1">
                                    Input:
                                  </div>
                                  <pre className="text-xs p-2 bg-white border border-slate-200 rounded font-mono">
                                    {typeof testResult.input === 'object' 
                                      ? JSON.stringify(testResult.input, null, 2) 
                                      : testResult.input}
                                  </pre>
                                </div>

                                {/* Expected Output */}
                                <div className="mb-2">
                                  <div className="text-xs font-semibold text-slate-700 mb-1">
                                    Expected:
                                  </div>
                                  <pre className="text-xs p-2 bg-white border border-slate-200 rounded font-mono">
                                    {typeof testResult.expected === 'object' 
                                      ? JSON.stringify(testResult.expected, null, 2) 
                                      : testResult.expected}
                                  </pre>
                                </div>

                                {/* Actual Output (if failed) */}
                                {!testResult.passed && testResult.actual !== undefined && (
                                  <div>
                                    <div className="text-xs font-semibold text-slate-700 mb-1">
                                      Your Output:
                                    </div>
                                    <pre className="text-xs p-2 bg-white border border-slate-200 rounded font-mono">
                                      {typeof testResult.actual === 'object' 
                                        ? JSON.stringify(testResult.actual, null, 2) 
                                        : testResult.actual}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Panel>
              </PanelGroup>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
