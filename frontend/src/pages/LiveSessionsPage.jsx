import { useNavigate } from "react-router";
import { useActiveSessions } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { 
  Zap, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Plus,
  KeyRound
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ActiveSessions from "../components/ActiveSessions";
import LiveCreateSessionModal from "../components/LiveCreateSessionModal";
import JoinSessionModal from "../components/JoinSessionModal";

function LiveSessionsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: activeSessionsData, isLoading } = useActiveSessions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const activeSessions = activeSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <DashboardLayout>
      {/* Header with Action Buttons */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Live Sessions</h1>
            <p className="text-slate-500 text-lg">
              Join active coding sessions and collaborate with other developers in real-time.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
            >
              <KeyRound className="size-4" />
              <span>Join Session</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="size-4" />
              <span>Create Session</span>
            </button>
          </div>
        </div>
      </div>

       {/* Stats Card */}
       <div className="card p-6 flex items-center justify-between border-l-4 border-l-orange-500 bg-white shadow-sm">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Zap className="size-8" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">{activeSessions.length}</div>
              <div className="text-slate-500 font-medium">Sessions Live Now</div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="size-10 animate-spin text-orange-500" />
            <p className="text-slate-400 animate-pulse">Scanning for sessions...</p>
          </div>
        ) : activeSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {activeSessions.map((session) => (
                // Reusing ActiveSessions component logic but mapping directly for grid layout in full page view
                // OR we can wrap ActiveSessions to support grid layout prop. 
                // For simplicity and matching DashboardPage style, let's use ActiveSessions component but it is designed as list.
                // Let's modify ActiveSessions to be grid aware or just use it as is (List view is fine for "Live Sessions" page too)
                null
             ))}
             {/* Actually ActiveSessions component maps a list. Let's just use it. */}
             <div className="col-span-full">
                <ActiveSessions
                  sessions={activeSessions}
                  isLoading={isLoading}
                  isUserInSession={isUserInSession}
                />
             </div>
          </div>
        ) : (
          <div className="card p-16 flex flex-col items-center justify-center text-center space-y-6 bg-white">
            <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center">
              <Sparkles className="size-12 text-slate-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">No Active Sessions</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                It's quiet right now. Be the first to start a live coding session and invite others!
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary"
            >
              <Plus className="size-5" />
              <span>Create New Session</span>
            </button>
          </div>
        )}

      {/* Modals */}
      <LiveCreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <JoinSessionModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </DashboardLayout>
  );
}

export default LiveSessionsPage;
