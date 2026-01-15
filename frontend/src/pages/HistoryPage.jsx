import { useNavigate } from "react-router";
import { useMyRecentSessions } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { 
  Clock, 
  Loader2, 
  Trophy,
  ArrowRight,
  Code2,
  UserPlus,
  UserCircle
} from "lucide-react";
import { useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import RecentSessions from "../components/RecentSessions";

function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: recentSessionsData, isLoading } = useMyRecentSessions();
  const [activeTab, setActiveTab] = useState("all");

  const allSessions = recentSessionsData?.sessions || [];
  const stats = recentSessionsData?.stats || {
    total: 0,
    created: 0,
    joined: 0,
    completed: 0,
    active: 0
  };

  // Filter sessions based on active tab
  const filteredSessions = useMemo(() => {
    switch (activeTab) {
      case "completed":
        return allSessions.filter(s => s.status === "completed");
      case "in-progress":
        return allSessions.filter(s => s.status === "active");
      case "all":
      default:
        return allSessions;
    }
  }, [allSessions, activeTab]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">History</h1>
        <p className="text-slate-500 text-lg">
          Review your past coding sessions and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-white border-2 border-slate-200 hover:border-orange-300 transition-all">
          <div className="flex items-center gap-6 mb-4">
            <div className="size-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Code2 className="size-8" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 mb-1">
                {stats.total}
              </div>
              <div className="text-slate-500 font-medium">Total Sessions</div>
            </div>
          </div>
          
          {/* Sub-categories */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <UserCircle className="size-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{stats.created}</div>
                <div className="text-xs text-slate-500">Created</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <UserPlus className="size-4 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">{stats.joined}</div>
                <div className="text-xs text-slate-500">Joined</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-6 group hover:border-green-200 transition-colors bg-white">
          <div className="size-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform duration-300">
            <Trophy className="size-8" />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
              {stats.completed}
            </div>
            <div className="text-slate-500 font-medium">Completed Challenges</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-2 py-2 font-semibold transition-colors ${
            activeTab === "all"
              ? "text-orange-600 border-b-2 border-orange-500 -mb-1.5"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-2 py-2 font-semibold transition-colors ${
            activeTab === "completed"
              ? "text-orange-600 border-b-2 border-orange-500 -mb-1.5"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab("in-progress")}
          className={`px-2 py-2 font-semibold transition-colors ${
            activeTab === "in-progress"
              ? "text-orange-600 border-b-2 border-orange-500 -mb-1.5"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          In Progress
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-10 animate-spin text-orange-500" />
          <p className="text-slate-400 animate-pulse">Loading history...</p>
        </div>
      ) : filteredSessions.length > 0 ? (
        <RecentSessions sessions={filteredSessions} isLoading={isLoading} />
      ) : (
        <div className="card p-16 flex flex-col items-center justify-center text-center space-y-6 bg-white">
          <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center">
            <Clock className="size-12 text-slate-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">
              {activeTab === "completed" ? "No Completed Sessions" : 
               activeTab === "in-progress" ? "No Active Sessions" : 
               "No Session History"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {activeTab === "completed" 
                ? "You haven't completed any sessions yet. Finish a session to see it here!" 
                : activeTab === "in-progress"
                ? "No sessions in progress. Start a new session to begin coding!"
                : "Your journey hasn't started yet. Create your first session to see it here!"}
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
