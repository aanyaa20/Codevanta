import { Zap, Trophy, Clock } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount, completedCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Active Count */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-orange-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
          <Zap className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-1">{activeSessionsCount}</div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">Active Sessions</div>
        </div>
      </div>

      {/* Completed Count */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-green-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-300">
          <Trophy className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-1">{completedCount}</div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">Challenges Won</div>
        </div>
      </div>

      {/* Total Sessions */}
      <div className="glass-card p-6 flex items-center gap-5 group hover:border-blue-500/30 transition-colors">
        <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
          <Clock className="size-7" />
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-1">{recentSessionsCount}</div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
