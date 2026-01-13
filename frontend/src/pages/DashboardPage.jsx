import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions";

import {
  Plus,
  Zap,
  Code2,
  Users,
  Trophy,
  ArrowRight,
  Target,
  Rocket,
  Clock,
  Sparkles
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import ActiveSessions from "../components/ActiveSessions";
import RecentActivity from "../components/RecentActivity";
import CreateSessionModal from "../components/CreateSessionModal";
import InvitePartnerModal from "../components/InvitePartnerModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
  });

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };

  // Calculate stats
  const completedSessions = recentSessions.filter((s) => s.status === "completed").length;

  return (
    <DashboardLayout>
      {/* Hero / Banner Section */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
        {/* Geometric Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500 via-amber-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-5 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-4 border border-orange-100">
              <Rocket className="size-3" />
              <span>Ready for a new challenge?</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-slate-900">
              Good morning, {user?.firstName || "Developer"}!
            </h1>
            <p className="text-lg text-slate-500 max-w-lg">
              You've completed {completedSessions} sessions so far. Keep the streak alive!
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
             <button
                onClick={() => navigate("/problems")}
                className="btn-secondary bg-white shadow-sm"
              >
                <Target className="size-4" />
                Practice
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary shadow-orange-500/20"
              >
                <Plus className="size-4" />
                Start Session
              </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 flex items-center gap-4 bg-white border-slate-200 hover:shadow-md transition-shadow">
          <div className="size-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Zap className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeSessions.length}</div>
            <div className="text-sm text-slate-500 font-medium">Active Sessions</div>
          </div>
        </div>
        
        <div className="card p-5 flex items-center gap-4 bg-white border-slate-200 hover:shadow-md transition-shadow">
          <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Trophy className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{completedSessions}</div>
            <div className="text-sm text-slate-500 font-medium">Completed</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4 bg-white border-slate-200 hover:shadow-md transition-shadow">
          <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Code2 className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{recentSessions.length}</div>
            <div className="text-sm text-slate-500 font-medium">Total Sessions</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4 bg-white border-slate-200 cursor-pointer hover:border-orange-300 transition-colors" onClick={() => setShowInviteModal(true)}>
           <div className="size-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <Users className="size-6" />
          </div>
          <div className="flex-1">
             <div className="text-base font-bold text-slate-900">Invite Friend</div>
             <div className="text-sm text-slate-500 font-medium">Collaborate</div>
          </div>
          <ArrowRight className="size-5 text-slate-300" />
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity / History Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-900">Problems Solved</h2>
             <button 
                onClick={() => navigate("/problems")}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                View All
              </button>
          </div>
          
          <RecentActivity />
        </div>

        {/* Right Column: Active Live Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Live Now</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-500">{activeSessions.length} Online</span>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[400px]">
             {loadingActiveSessions ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin size-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                </div>
             ) : activeSessions.length > 0 ? (
                <div className="space-y-3">
                  {activeSessions.slice(0, 4).map((session) => (
                    <div key={session._id} className="p-3 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer group" onClick={() => navigate(`/session/${session._id}`)}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-700 line-clamp-1">{session.problem}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{session.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <div className="flex items-center gap-1.5 text-xs text-slate-500">
                           <Users className="size-3" />
                           <span>{session.participant ? "2/2" : "1/2"}</span>
                         </div>
                         <button className="text-xs font-medium text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                           Join <ArrowRight className="size-3" />
                         </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => navigate("/sessions/active")} 
                    className="w-full py-2 text-center text-sm text-slate-500 hover:text-orange-600 font-medium border-t border-slate-100 mt-2 pt-3"
                  >
                    View All Active Sessions
                  </button>
                </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Sparkles className="size-8 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500">No public sessions right now.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm text-orange-600 font-semibold hover:underline"
                  >
                    Start one now
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

      <InvitePartnerModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        activeSessions={activeSessions}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
