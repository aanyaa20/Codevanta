import { useNavigate } from "react-router";
import { useActiveSessions } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { 
  Zap, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Plus
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ActiveSessions from "../components/ActiveSessions";

function LiveSessionsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: activeSessionsData, isLoading } = useActiveSessions();

  const activeSessions = activeSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <DashboardLayout>
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
          
          <div className="hidden sm:flex flex-col items-end">
             <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-200 animate-pulse flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               LIVE UPDATES
             </span>
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
    </DashboardLayout>
  );
}

export default LiveSessionsPage;
