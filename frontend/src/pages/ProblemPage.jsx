import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { Loader2, ArrowLeft } from "lucide-react";

function ProblemPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProblem();
    }
  }, [slug]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/problems/${slug}`);
      const fetchedProblem = response.data.problem;
      setProblem(fetchedProblem);

      // Set initial code
      if (fetchedProblem.starterCode && fetchedProblem.starterCode[selectedLanguage]) {
        setCode(fetchedProblem.starterCode[selectedLanguage]);
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to load problem");
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);

    if (problem?.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }

    setOutput(null);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await axiosInstance.post(`/problems/${slug}/run`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;

      setOutput({
        success: result.status !== "Runtime Error" && result.status !== "Compilation Error",
        status: result.status,
        passed: result.passed,
        total: result.total,
        results: result.results,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
      });

      if (result.status === "Accepted") {
        toast.success(`All ${result.passed} test cases passed!`);
      } else if (result.passed > 0) {
        toast.error(`${result.passed}/${result.total} test cases passed`);
      } else {
        toast.error(result.status);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput({
        success: false,
        error: error.response?.data?.message || "Failed to run code",
      });
      toast.error("Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);

    try {
      const response = await axiosInstance.post(`/problems/${slug}/submit`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;

      setOutput({
        success: result.status === "Accepted",
        status: result.status,
        passed: result.passed,
        total: result.total,
        results: result.results,
        runtime: result.runtime,
        errorMessage: result.errorMessage,
        isSubmission: true,
      });

      if (result.status === "Accepted") {
        triggerConfetti();
        toast.success(`Accepted! ${result.passed}/${result.total} test cases passed!`);
      } else {
        toast.error(`${result.status} - ${result.passed}/${result.total} test cases passed`);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput({
        success: false,
        error: error.response?.data?.message || "Failed to submit code",
      });
      toast.error("Failed to submit code");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Problem not found</h2>
          <button
            onClick={() => navigate("/problems")}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/problems")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="size-5" />
          <span>All Problems</span>
        </button>
        {problem && (
          <>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-semibold text-slate-900">{problem.title}</h1>
          </>
        )}
      </div>

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel - problem description */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription problem={problem} />
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-col-resize" />

          {/* Right panel - code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel */}
              <Panel defaultSize={30} minSize={20}>
                <OutputPanel 
                  testResults={output} 
                  isRunning={isRunning}
                />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
