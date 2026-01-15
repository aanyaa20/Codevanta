import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, ShareIcon, ArrowLeftIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import InviteToSessionModal from "../components/InviteToSessionModal";
import ProblemDescription from "../components/ProblemDescription";
import PageHeader from "../components/PageHeader";
import axiosInstance from "../lib/axios";
import SubmissionsPanel from "../components/SubmissionsPanel";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [problemData, setProblemData] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [recordingId, setRecordingId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // Fetch submissions for the problem
  const fetchSubmissions = async (slug) => {
    if (!slug) return;
    try {
      setLoadingSubmissions(true);
      const response = await axiosInstance.get(`/problems/${slug}/submissions`);
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Fetch problem data from API when session loads
  useEffect(() => {
    const fetchProblemData = async () => {
      if (!session?.problem) return;
      
      try {
        setLoadingProblem(true);
        // Try to find problem by title from all problems
        const response = await axiosInstance.get("/problems");
        const problems = response.data.problems || [];
        const problem = problems.find((p) => p.title === session.problem);
        
        if (problem) {
          // Fetch full problem details
          const detailResponse = await axiosInstance.get(`/problems/${problem.slug}`);
          setProblemData(detailResponse.data.problem);
          // Fetch submissions for this problem
          fetchSubmissions(problem.slug);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchProblemData();
  }, [session?.problem]);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Update code when problem data loads
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput({ error: "Please write some code first!" });
      return;
    }

    if (!problemData) {
      setOutput({ error: "Problem data not loaded yet!" });
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      // Use backend API for proper code execution (like Problems page)
      const response = await axiosInstance.post(`/problems/${problemData.slug}/run`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;
      setOutput(result);

      if (result.status === "Accepted") {
        // Optional: Show success toast
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput({
        error: error.response?.data?.message || "Failed to run code",
        output: ""
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      console.log("🎥 Starting recording...");
      console.log("  Call object:", call);
      console.log("  Call ID:", call.id);
      
      // Start recording via Stream SDK
      const streamResponse = await call.startRecording();
      console.log("✅ Stream startRecording response:", streamResponse);
      
      // Create recording entry in database
      const response = await axiosInstance.post("/recordings/start", {
        sessionId: id,
        callId: call.id,
        problemTitle: problemData?.title,
        difficulty: problemData?.difficulty,
      });
      
      setRecordingId(response.data._id);
      toast.success("🔴 Recording started!");
      console.log("✅ Recording saved to database:", response.data);
    } catch (error) {
      console.error("❌ Failed to start recording:", error);
      console.error("  Error details:", error.message);
      console.error("  Error response:", error.response?.data);
      toast.error(`Failed to start recording: ${error.message || "Unknown error"}`);
    }
  };

  const handleStopRecording = async () => {
    try {
      // Stop recording via Stream SDK
      await call.stopRecording();
      
      // Update recording entry in database
      if (recordingId) {
        await axiosInstance.post("/recordings/stop", {
          recordingId,
          callId: call.id,
        });
        toast.success("✅ Recording stopped! Check 'Recorded Sessions' in a few moments.");
      }
      
      setRecordingId(null);
      console.log("Recording stopped");
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Failed to stop recording.");
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput({ error: "Please write some code first!" });
      return;
    }

    if (!problemData) {
      setOutput({ error: "Problem data not loaded yet!" });
      return;
    }

    setIsSubmitting(true);
    setOutput(null);

    try {
      const response = await axiosInstance.post(`/problems/${problemData.slug}/submit`, {
        code,
        language: selectedLanguage,
      });

      const result = response.data;
      setOutput(result);

      // Show feedback
      if (result.status === "Accepted") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("🎉 Accepted! All test cases passed!");
      } else {
        toast.error(`Submission failed: ${result.status}`);
      }

      // Refresh submissions
      fetchSubmissions(problemData.slug);
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput({
        error: error.response?.data?.message || "Failed to submit code",
        output: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  if (loadingSession) {
    return (
        <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-900">
            <Loader2Icon className="size-12 animate-spin text-orange-500" />
        </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
        <PageHeader
          title={session?.problem || "Loading..."}
          subtitle={`Host: ${session?.host?.name || "Loading..."}`}
          status={{
            isOnline: !!session?.participant,
            text: session?.participant ? "2/2 Online" : "Waiting for participant..."
          }}
          difficulty={session?.difficulty}
          onBack={() => navigate("/dashboard")}
          isHost={isHost}
          onInvite={session?.status === "active" ? () => setShowInviteModal(true) : null}
          onEndSession={session?.status === "active" ? handleEndSession : null}
          isLoading={endSessionMutation.isPending}
        />

      <div className="flex-1 overflow-hidden relative">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={65} minSize={40}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESC & SUBMISSIONS TABS */}
              <Panel defaultSize={40} minSize={20} className="bg-white">
                <div className="h-full flex flex-col">
                  {/* Tabs */}
                  <div className="border-b border-slate-200 bg-slate-50 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveTab("description")}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                          activeTab === "description"
                            ? "text-slate-900 bg-white border-t border-x border-slate-200 rounded-t"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Description
                      </button>
                      <button
                        onClick={() => setActiveTab("submissions")}
                        className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                          activeTab === "submissions"
                            ? "text-slate-900 bg-white border-t border-x border-slate-200 rounded-t"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Submissions ({submissions.length})
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto">
                    {activeTab === "description" && (
                      <div className="h-full">
                        {loadingProblem ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2Icon className="size-8 animate-spin text-orange-500" />
                          </div>
                        ) : problemData ? (
                          <ProblemDescription 
                            problem={problemData} 
                            currentProblemId={problemData._id} 
                            allProblems={[problemData]}
                            onProblemChange={() => {}} // Disable changing problem in session
                            isSessionMode={true}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            Problem data not found
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "submissions" && (
                      <div className="p-4">
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

              <PanelResizeHandle className="h-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-row-resize" />

              <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      isSubmitting={isSubmitting}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                      onSubmitCode={handleSubmit}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={10}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={35} minSize={20} className="bg-slate-50 border-l border-slate-200">
            <div className="h-full flex flex-col">
              {isInitializingCall ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="size-10 mx-auto animate-spin text-orange-500 mb-4" />
                    <p className="text-slate-500">Connecting to secure room...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="card p-8 text-center max-w-sm">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <PhoneOffIcon className="size-8 text-red-500" />
                      </div>
                      <h2 className="text-xl font-bold mb-2 text-slate-900">Connection Failed</h2>
                      <p className="text-slate-500 text-sm">Unable to establish a secure connection to the video room.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full relative">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI 
                        chatClient={chatClient} 
                        channel={channel}
                        isHost={isHost}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        isRecording={!!recordingId}
                      />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <InviteToSessionModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        sessionId={id}
      />
    </div>
  );
}

export default SessionPage;
