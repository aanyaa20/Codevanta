import {
  ArrowRight,
  Code2,
  Crown,
  Users,
  Loader2,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions = [], isLoading, isUserInSession }) {
  if (isLoading) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center gap-4 min-h-[200px] bg-white border-slate-200">
        <Loader2 className="size-8 animate-spin text-[var(--accent-primary)]" />
        <p className="text-[var(--text-secondary)] text-sm animate-pulse">Scanning active sessions...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center gap-6 min-h-[200px] bg-white border-slate-200">
        <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center">
          <Sparkles className="size-8 text-slate-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1 text-slate-900">No Active Sessions</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            It's quiet right now. Why not start a new session?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {sessions.map((session) => (
        <div
          key={session._id}
          className="card p-4 group transition-all duration-200 hover:border-orange-200 hover:shadow-md bg-white border-slate-200"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Session Info */}
            <div className="flex items-start gap-4 flex-1 w-full">
              <div className="relative shrink-0">
                <div className="size-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  <Code2 className="size-6 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base text-slate-900 truncate group-hover:text-[var(--accent-primary)] transition-colors">
                    {session.problem}
                  </h3>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      getDifficultyBadgeClass(session.difficulty)
                    }`}
                  >
                    {session.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1" title="Host">
                    <Crown className="size-3 text-yellow-500" />
                    <span className="font-medium">
                      {session.host?.name || "Host"}
                    </span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-slate-300" />

                  <div className="flex items-center gap-1" title="Participants">
                    <Users className="size-3" />
                    <span>
                      {session.participant ? "2/2" : "1/2"}
                    </span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-slate-300" />

                  <div className="flex items-center gap-1" title="Created">
                    <Clock className="size-3" />
                    <span>Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              {session.participant && !isUserInSession(session) ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider cursor-not-allowed border border-slate-100 flex items-center justify-center gap-2"
                >
                  Full
                </button>
              ) : (
                <Link
                  to={`/session/${session._id}`}
                  className="btn-primary w-full sm:w-auto py-2 px-4 text-xs uppercase tracking-wider font-bold shadow-none hover:shadow-lg hover:shadow-orange-500/20"
                >
                  {isUserInSession(session) ? "Rejoin" : "Join"}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActiveSessions;
