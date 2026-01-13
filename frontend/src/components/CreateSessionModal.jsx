import { Code2, Loader2, Plus, X } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-900">Create New Session</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Problem Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Select Challenge <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer shadow-sm"
                value={roomConfig.problem}
                onChange={(e) => {
                  const selectedProblem = problems.find((p) => p.title === e.target.value);
                  setRoomConfig({
                    difficulty: selectedProblem.difficulty,
                    problem: e.target.value,
                  });
                }}
              >
                <option value="" disabled>Choose a coding challenge...</option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.title}>
                    {problem.title} • {problem.difficulty}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Code2 className="size-5" />
              </div>
            </div>
          </div>

          {/* Room Summary */}
          {roomConfig.problem && (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                <Code2 className="size-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 text-sm mb-1">Session Summary</h4>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Challenge: <span className="text-slate-900 font-medium">{roomConfig.problem}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Difficulty: <span className="text-slate-900 font-medium capitalize">{roomConfig.difficulty}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Mode: <span className="text-slate-900 font-medium">1-on-1 Pair Programming</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-3">
          <button 
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn-primary py-2.5 text-sm min-w-[140px] shadow-lg shadow-orange-500/20"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Create Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;
