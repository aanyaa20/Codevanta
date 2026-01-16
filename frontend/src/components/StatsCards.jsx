import { Zap, Trophy, Clock } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount, completedCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Count */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-cyan-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform duration-300">
          <Zap className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{activeSessionsCount}</div>
          <div className="text-sm font-medium text-slate-600">Active Sessions</div>
        </div>
      </div>

      {/* Completed Count */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-teal-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-300">
          <Trophy className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{completedCount}</div>
          <div className="text-sm font-medium text-slate-600">Challenges Won</div>
        </div>
      </div>

      {/* Total Sessions */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-sky-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-300">
          <Clock className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{recentSessionsCount}</div>
          <div className="text-sm font-medium text-slate-600">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
