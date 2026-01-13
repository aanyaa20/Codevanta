import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, PhoneOffIcon, ShareIcon, ArrowLeftIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import InviteToSessionModal from "../components/InviteToSessionModal";
import ProblemDescription from "../components/ProblemDescription"; 

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

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

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

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

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
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
        {/* Top Navigation Bar for Session */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeftIcon className="size-5" />
                </button>
                <div>
                    <h1 className="font-bold text-lg leading-tight truncate max-w-md text-slate-900">
                        {session?.problem || "Loading..."}
                    </h1>
                     <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Host: {session?.host?.name || "Loading..."}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className={session?.participant ? "text-green-600 font-medium" : "text-amber-500 font-medium"}>
                            {session?.participant ? "2/2 Online" : "Waiting for participant..."}
                        </span>
                     </div>
                </div>
                {session?.difficulty && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${
                        session.difficulty === "easy" ? "bg-green-100 text-green-700 border-green-200" :
                        session.difficulty === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-red-100 text-red-700 border-red-200"
                    }`}>
                        {session.difficulty}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                 {isHost && session?.status === "active" && (
                    <>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn-secondary py-2 px-3 text-sm h-9 border-slate-200 hover:bg-slate-100"
                    >
                        <ShareIcon className="size-4" />
                        <span className="hidden sm:inline">Invite</span>
                    </button>
                    <button
                        onClick={handleEndSession}
                        disabled={endSessionMutation.isPending}
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 h-9"
                    >
                        {endSessionMutation.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                        <LogOutIcon className="size-4" />
                        )}
                        <span className="hidden sm:inline">End Session</span>
                    </button>
                    </>
                )}
            </div>
        </div>

      <div className="flex-1 overflow-hidden relative">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={65} minSize={40}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DESC & EDITOR SPLIT */}
               {/* Note: In a real app we might want tabs here, but sticking to split view for now */}
              <Panel defaultSize={40} minSize={20} className="bg-white">
                {problemData ? (
                    <ProblemDescription 
                        problem={problemData} 
                        // Just passing required props, assuming single problem view for session
                        currentProblemId={problemData.id} 
                        allProblems={Object.values(PROBLEMS)}
                        onProblemChange={() => {}} // Disable changing problem in session
                        isSessionMode={true} // New prop to simplify display
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        Problem data not found
                    </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-slate-200 hover:bg-orange-400 transition-colors cursor-row-resize" />

              <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
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
                      <VideoCallUI chatClient={chatClient} channel={channel} />
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
