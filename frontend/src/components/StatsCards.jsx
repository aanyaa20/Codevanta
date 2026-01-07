import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="card bg-white border-2 border-blue-200 hover:border-blue-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <UsersIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div className="badge badge-primary">Live</div>
          </div>
          <div className="text-4xl font-black mb-1">{activeSessionsCount}</div>
          <div className="text-sm opacity-60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card bg-white border-2 border-indigo-200 hover:border-indigo-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <TrophyIcon className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
          <div className="text-4xl font-black mb-1">{recentSessionsCount}</div>
          <div className="text-sm opacity-60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;