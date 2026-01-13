import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({ problem }) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 bg-white border-r border-slate-200">
      {/* HEADER SECTION */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">{problem.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getDifficultyBadgeClass(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {problem.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* DESCRIPTION TEXT */}
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
            {problem.description}
          </p>
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
