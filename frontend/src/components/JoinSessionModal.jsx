import { X, Link as LinkIcon, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultiFactor from "./MultiFactor";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router";

function JoinSessionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("code"); // "code" or "link"
  const [joinCode, setJoinCode] = useState("");
  const [joinLink, setJoinLink] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoinByCode = async (code) => {
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-character code");
      return;
    }

    try {
      setIsJoining(true);
      setError("");
      
      const response = await axiosInstance.post("/sessions/join-by-code", {
        joinCode: code.toUpperCase(),
      });

      const sessionId = response.data.sessionId;
      onClose();
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error joining session:", error);
      setError(error.response?.data?.message || "Invalid join code. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinByLink = async () => {
    if (!joinLink.trim()) {
      setError("Please enter an invite link");
      return;
    }

    try {
      setIsJoining(true);
      setError("");

      // Extract session ID from link
      const match = joinLink.match(/\/session\/([a-zA-Z0-9]+)/);
      if (!match) {
        setError("Invalid invite link format");
        setIsJoining(false);
        return;
      }

      const sessionId = match[1];
      
      // Join the session
      await axiosInstance.post(`/sessions/${sessionId}/join`);
      
      onClose();
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error("Error joining session:", error);
      setError(error.response?.data?.message || "Failed to join session. Please check the link.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setJoinCode("");
      setJoinLink("");
      setError("");
      setActiveTab("code");
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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
          <h3 className="text-2xl font-bold text-slate-900">
            Join Session
          </h3>
          <button 
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setActiveTab("code");
              setError("");
            }}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === "code"
                ? "text-cyan-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <KeyRound className="size-4" />
              <span>Join by Code</span>
            </div>
            {activeTab === "code" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500"
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              />
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("link");
              setError("");
            }}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === "link"
                ? "text-cyan-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LinkIcon className="size-4" />
              <span>Join by Link</span>
            </div>
            {activeTab === "link" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500"
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "code" ? (
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-600">
                    Enter the 6-character code shared by the host
                  </p>
                </div>

                {/* OTP Input */}
                <div className="py-4">
                  <MultiFactor
                    value={joinCode}
                    onChange={(val) => {
                      setJoinCode(val);
                      setError("");
                    }}
                    onComplete={(code) => {
                      if (!isJoining) {
                        handleJoinByCode(code);
                      }
                    }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Join Button */}
                <button
                  onClick={() => handleJoinByCode(joinCode)}
                  disabled={joinCode.length !== 6 || isJoining}
                  className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Session</span>
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="link-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <p className="text-sm text-slate-600">
                    Paste the invite link shared by the host
                  </p>
                </div>

                {/* Link Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://codevanta.com/session/..."
                      value={joinLink}
                      onChange={(e) => {
                        setJoinLink(e.target.value);
                        setError("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
                    />
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Join Button */}
                <button
                  onClick={handleJoinByLink}
                  disabled={!joinLink.trim() || isJoining}
                  className="w-full px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Session</span>
                      <ArrowRight className="size-5" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="px-8 pb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              💡 <span className="font-medium">Tip:</span> You can get the invite code or link from the person hosting the session.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default JoinSessionModal;
