import { Code2, Loader2, Plus, X, Search, CheckCircle, Copy, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import AlertModal from "./ui/AlertModal";
import { useCreateSession } from "../hooks/useSessions";
import { useNavigate } from "react-router";

function LiveCreateSessionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [allProblems, setAllProblems] = useState([]);
  const [displayedProblems, setDisplayedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const createSessionMutation = useCreateSession();
  
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
  });

  // Fetch problems
  useEffect(() => {
    if (isOpen) {
      fetchProblems();
      // Reset states when modal opens
      setSelectedProblem(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/problems");
      const problems = response.data.problems || [];
      setAllProblems(problems);
      
      const randomCount = Math.min(6, problems.length);
      const randomProblems = problems
        .sort(() => Math.random() - 0.5)
        .slice(0, randomCount);
      setDisplayedProblems(randomProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setDisplayedProblems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      const randomCount = Math.min(6, allProblems.length);
      const randomProblems = allProblems
        .sort(() => Math.random() - 0.5)
        .slice(0, randomCount);
      setDisplayedProblems(randomProblems);
    } else {
      const filtered = allProblems.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayedProblems(filtered);
    }
  }, [searchQuery, allProblems]);

  const handleCreateSession = async () => {
    if (!selectedProblem) return;

    console.log("🚀 Creating session from LiveSessions page...");
    console.log("  Problem:", selectedProblem.title);
    console.log("  Difficulty:", selectedProblem.difficulty);

    const payload = {
      problem: selectedProblem.title,
      difficulty: selectedProblem.difficulty.toLowerCase(),
    };

    console.log("  Payload:", payload);

    createSessionMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log("✅ Session created successfully!");
        console.log("  Response:", data);
        console.log("  Session ID:", data.session._id);
        console.log("  Join Code:", data.joinCode);
        
        // Close modal and navigate to session immediately (like Dashboard)
        onClose();
        navigate(`/session/${data.session._id}`);
      },
      onError: (error) => {
        console.error("❌ Failed to create session:", error);
        console.error("  Error response:", error.response?.data);
        setAlertState({
          open: true,
          message: error.response?.data?.message || "Please try again.",
        });
      },
    });
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setSelectedProblem(null);
      setSearchQuery("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Content */}
      <motion.div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <h3 className="text-2xl font-bold text-slate-900">
            Create New Session
          </h3>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <motion.div
            className="space-y-6"
          >
                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Search Problems
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by problem name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    {searchQuery ? `Found ${displayedProblems.length} problem(s)` : `Showing ${displayedProblems.length} random problems`}
                  </p>
                </div>

                {/* Problem Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Select Challenge <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      value={selectedProblem?.title || ""}
                      disabled={loading || displayedProblems.length === 0}
                      onChange={(e) => {
                        const problem = displayedProblems.find((p) => p.title === e.target.value);
                        setSelectedProblem(problem);
                      }}
                    >
                      <option value="" disabled>
                        {loading ? "Loading problems..." : displayedProblems.length === 0 ? "No problems found" : "Choose a coding challenge..."}
                      </option>
                      {displayedProblems.map((problem) => (
                        <option key={problem._id} value={problem.title}>
                          {problem.title} • {problem.difficulty}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Code2 className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Session Summary */}
                {selectedProblem && (
                  <motion.div 
                    className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 border border-cyan-100 flex items-start gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-2 bg-white rounded-lg shrink-0 shadow-sm">
                      <Code2 className="size-5 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-900 text-sm mb-1">Session Summary</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">
                          Challenge: <span className="text-slate-900 font-medium">{selectedProblem.title}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Difficulty: <span className="text-slate-900 font-medium capitalize">{selectedProblem.difficulty}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Mode: <span className="text-slate-900 font-medium">1-on-1 Pair Programming</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={handleClose}
            disabled={createSessionMutation.isPending}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
            onClick={handleCreateSession}
            disabled={createSessionMutation.isPending || !selectedProblem}
          >
            {createSessionMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Create Session</span>
              </>
            )}
          </button>
        </div>

        {/* Alert Modal */}
        <AlertModal
          open={alertState.open}
          title="Failed to create session"
          message={alertState.message}
          buttonText="OK"
          onClose={() => setAlertState({ open: false, message: "" })}
        />
      </motion.div>
    </div>
  );
}

export default LiveCreateSessionModal;
