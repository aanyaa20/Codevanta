import { useNavigate } from "react-router";
import { useMyRecentSessions } from "../hooks/useSessions";
import { 
  Clock, 
  Loader2, 
  Trophy,
  ArrowRight,
  Code2
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import RecentSessions from "../components/RecentSessions";

function HistoryPage() {
  const navigate = useNavigate();
  const { data: recentSessionsData, isLoading } = useMyRecentSessions();

  const recentSessions = recentSessionsData?.sessions || [];
  const completedSessions = recentSessions.filter(s => s.status === "completed");

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex items-center gap-6 group hover:border-orange-200 transition-colors bg-white">
          <div className="size-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="size-8" />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
              {recentSessions.length}
            </div>
            <div className="text-slate-500 font-medium">Total Sessions</div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-6 group hover:border-green-200 transition-colors bg-white">
          <div className="size-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform duration-300">
            <Trophy className="size-8" />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
              {completedSessions.length}
            </div>
            <div className="text-slate-500 font-medium">Completed Challenges</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Visual Only for now) */}
      <div className="flex items-center gap-6 border-b border-slate-200 pb-1">
        <button className="px-2 py-2 text-orange-600 font-semibold border-b-2 border-orange-500 -mb-1.5">
          All Sessions
        </button>
        <button className="px-2 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          Completed
        </button>
        <button className="px-2 py-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          In Progress
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-orange-500" />
          <p className="text-slate-400 animate-pulse">Loading history...</p>
        </div>
      ) : recentSessions.length > 0 ? (
        <RecentSessions sessions={recentSessions} isLoading={isLoading} />
      ) : (
        <div className="card p-16 flex flex-col items-center justify-center text-center space-y-6 bg-white">
          <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center">
            <Clock className="size-12 text-slate-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">No Session History</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Your journey hasn't started yet. Create your first session to see it here!
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            <span>Start Session</span>
            <ArrowRight className="size-5" />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default HistoryPage;
