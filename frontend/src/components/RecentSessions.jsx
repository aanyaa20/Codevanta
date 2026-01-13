import { Code2, Clock, Calendar, CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

function RecentSessions({ sessions = [], isLoading, compact = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="card p-8 flex justify-center bg-white border-slate-200">
        <div className="size-8 rounded-full border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] animate-spin" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card p-8 text-center space-y-4 bg-white border-slate-200">
        <div className="size-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center">
          <Clock className="size-8 text-slate-300" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">No recent history</p>
          <p className="text-sm text-slate-500">Your completed sessions will appear here.</p>
        </div>
      </div>
    );
  }

  // If compact mode (for dashboard list view if needed, though DashboardPage implements its own table now)
  if (compact) {
    return (
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => (
          <div
            key={session._id}
            className="group flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50/10 transition-all cursor-pointer shadow-sm"
            onClick={() => navigate(`/session/${session._id}`)}
          >
            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
              session.status === "completed" 
                ? "bg-green-50 text-green-600" 
                : "bg-orange-50 text-orange-600"
            }`}>
              {session.status === "completed" ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Code2 className="size-5" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                {session.problem}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <ArrowRight className="size-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
        ))}
      </div>
    );
  }

  // Full view (grid layout for History Page)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <div
          key={session._id}
          className="card p-6 flex flex-col h-full group hover:shadow-md hover:border-orange-200 transition-all bg-white"
          onClick={() => navigate(`/session/${session._id}`)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
              session.status === "completed"
                ? "bg-green-50 text-green-600"
                : "bg-orange-50 text-orange-600"
            }`}>
              {session.status === "completed" ? (
                <Trophy className="size-6" />
              ) : (
                <Code2 className="size-6" />
              )}
            </div>
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getDifficultyBadgeClass(session.difficulty)}`}>
              {session.difficulty}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 mb-6">
            <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {session.problem}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              session.status === "completed" ? "text-green-600" : "text-orange-600"
            }`}>
              {session.status}
            </span>
            <button className="text-sm font-medium text-slate-400 group-hover:text-orange-600 transition-colors flex items-center gap-1">
              Details <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentSessions;
