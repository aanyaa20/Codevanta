import { Link } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import { PROBLEMS } from "../data/problems";
import { ChevronRight, Code2, ArrowUpRight, Filter } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900">Practice Problems</h1>
          <p className="text-slate-500 text-lg">
            Sharpen your skills with our curated collection of coding challenges.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 group hover:border-indigo-500/30 transition-colors bg-white">
          <div className="text-sm text-slate-500 font-medium mb-1">Total Problems</div>
          <div className="text-3xl font-bold text-slate-900">{problems.length}</div>
        </div>

        <div className="card p-5 group hover:border-green-500/30 transition-colors bg-white">
          <div className="text-sm text-slate-500 font-medium mb-1">Easy</div>
          <div className="text-3xl font-bold text-green-500">{easyProblemsCount}</div>
        </div>

        <div className="card p-5 group hover:border-yellow-500/30 transition-colors bg-white">
          <div className="text-sm text-slate-500 font-medium mb-1">Medium</div>
          <div className="text-3xl font-bold text-yellow-500">{mediumProblemsCount}</div>
        </div>

        <div className="card p-5 group hover:border-red-500/30 transition-colors bg-white">
          <div className="text-sm text-slate-500 font-medium mb-1">Hard</div>
          <div className="text-3xl font-bold text-red-500">{hardProblemsCount}</div>
        </div>
      </div>

      {/* Filters Bar (Visual only for now) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm whitespace-nowrap shadow-sm">
          All Problems
        </button>
        {["Arrays", "Strings", "Dynamic Programming", "Trees", "Graphs"].map((tag) => (
          <button key={tag} className="px-4 py-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 font-medium text-sm whitespace-nowrap border border-slate-200 transition-colors shadow-sm">
            {tag}
          </button>
        ))}
        <button className="ml-auto p-2 rounded-lg bg-white text-slate-500 hover:text-slate-900 border border-slate-200 shadow-sm">
          <Filter className="size-4" />
        </button>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            to={`/problem/${problem.id}`}
            className="card p-6 block group border-l-4 border-l-transparent hover:border-l-orange-500 transition-all bg-white hover:shadow-md"
          >
            <div className="flex items-start md:items-center gap-6">
              
              {/* Icon */}
              <div className="hidden md:flex size-12 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
                <Code2 className="size-6 text-slate-400 group-hover:text-orange-500 transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                    {problem.title}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyBadgeClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600 border border-slate-200">
                    {problem.category}
                  </span>
                  <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
                  <p className="line-clamp-1 flex-1 text-slate-400">{problem.description.text}</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-orange-500 transition-colors font-medium text-sm shrink-0">
                <span className="hidden sm:inline">Solve Challenge</span>
                <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default ProblemsPage;
