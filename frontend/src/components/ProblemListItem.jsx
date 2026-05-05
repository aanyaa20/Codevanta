import { memo } from "react";
import { Link } from "react-router";
import { Code2, ChevronRight } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

const ProblemListItem = memo(({ problem }) => {
  return (
    <Link
      key={problem._id}
      to={`/problem/${problem.slug}`}
      className="card p-6 block group border-l-4 border-l-transparent hover:border-l-cyan-500 transition-all bg-white/80 backdrop-blur-sm hover:shadow-lg"
    >
      <div className="flex items-start md:items-center gap-6">
        {/* Icon */}
        <div className="hidden md:flex size-12 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center shrink-0 group-hover:bg-cyan-50 transition-colors">
          <Code2 className="size-6 text-slate-400 group-hover:text-cyan-500 transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
              {problem.title}
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyBadgeClass(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-1">
            {problem.tags && problem.tags.length > 0 && (
              <>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600 border border-slate-200">
                  {problem.tags.join(" • ")}
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
              </>
            )}
            {problem.acceptanceRate > 0 && (
              <span className="text-slate-400">
                Acceptance: {problem.acceptanceRate.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2 text-slate-400 group-hover:text-orange-500 transition-colors font-medium text-sm shrink-0">
          Solve
          <ChevronRight className="size-5" />
        </div>
      </div>
    </Link>
  );
});

ProblemListItem.displayName = "ProblemListItem";

export default ProblemListItem;
