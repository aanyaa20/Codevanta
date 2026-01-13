import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems, isSessionMode = false }) {
  // If we are in session mode, we might want a simplified view or specific styling
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 bg-white border-r border-slate-200">
      
      {/* HEADER SECTION */}
      {!isSessionMode && (
          <div className="card p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                problem.difficulty === "easy" ? "bg-green-100 text-green-700" :
                problem.difficulty === "medium" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-4">{problem.category}</p>

            {/* Problem selector - Only show if we can change problems */}
             <div className="relative">
                <select
                    className="input-modern w-full text-sm appearance-none cursor-pointer"
                    value={currentProblemId}
                    onChange={(e) => onProblemChange(e.target.value)}
                >
                    {allProblems.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-900">
                        {p.title} ({p.difficulty})
                    </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                </div>
            </div>
          </div>
      )}

      {/* If in session mode, maybe just show title simpler */}
      {isSessionMode && (
          <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900">Description</h2>
              </div>
          </div>
      )}


      <div className="space-y-8">
        {/* DESCRIPTION TEXT */}
        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed text-sm">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
                <p key={idx} className="text-slate-500 italic text-sm mt-2 border-l-2 border-blue-500/50 pl-3 bg-blue-50 py-1 pr-2 rounded-r">
                  Note: {note}
                </p>
            ))}
        </div>

        {/* EXAMPLES SECTION */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Examples</h3>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="card p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center size-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="font-medium text-slate-700 text-sm">Example {idx + 1}</p>
                </div>
                
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex gap-3">
                    <span className="text-blue-600 font-semibold min-w-[60px]">Input:</span>
                    <span className="text-slate-600">{example.input}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-semibold min-w-[60px]">Output:</span>
                    <span className="text-slate-600">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 mt-2 border-t border-slate-200">
                      <p className="text-slate-500 leading-relaxed">
                        <span className="text-slate-600 font-semibold">Explanation:</span> {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div>
           <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Constraints</h3>
           <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <ul className="space-y-2">
                    {problem.constraints.map((constraint, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-600 font-mono">
                        <span className="text-red-500">•</span>
                        {constraint}
                    </li>
                    ))}
                </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
