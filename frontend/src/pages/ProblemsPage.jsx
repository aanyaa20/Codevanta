import { Link } from "react-router";
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { ChevronRight, Code2, Filter, Loader2 } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import axiosInstance from "../lib/axios";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: "", tags: "" });
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  // Fetch total stats once on mount (independent of filters)
  useEffect(() => {
    fetchTotalStats();
  }, []);

  // Fetch filtered problems when filter changes
  useEffect(() => {
    fetchProblems();
  }, [filter]);

  const fetchTotalStats = async () => {
    try {
      // Fetch all problems without filters to get true totals
      const response = await axiosInstance.get("/problems");
      const allProblems = response.data.problems || [];

      setStats({
        total: allProblems.length,
        easy: allProblems.filter((p) => p.difficulty === "Easy").length,
        medium: allProblems.filter((p) => p.difficulty === "Medium").length,
        hard: allProblems.filter((p) => p.difficulty === "Hard").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.tags) params.tags = filter.tags;

      const response = await axiosInstance.get("/problems", { params });
      const fetchedProblems = response.data.problems || [];
      setProblems(fetchedProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyFilter = (difficulty) => {
    setFilter((prev) => ({
      ...prev,
      difficulty: prev.difficulty === difficulty ? "" : difficulty,
    }));
  };

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
        <div className="card p-5 group transition-colors bg-white border-2 border-slate-200">
          <div className="text-sm text-slate-500 font-medium mb-1">Total Problems</div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div
          className={`card p-5 group transition-colors bg-white cursor-pointer border-2 ${
            filter.difficulty === "Easy"
              ? "border-green-500 bg-green-50"
              : "border-transparent hover:border-green-500/30"
          }`}
          onClick={() => handleDifficultyFilter("Easy")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Easy</div>
          <div className="text-3xl font-bold text-green-500">{stats.easy}</div>
        </div>

        <div
          className={`card p-5 group transition-colors bg-white cursor-pointer border-2 ${
            filter.difficulty === "Medium"
              ? "border-yellow-500 bg-yellow-50"
              : "border-transparent hover:border-yellow-500/30"
          }`}
          onClick={() => handleDifficultyFilter("Medium")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Medium</div>
          <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
        </div>

        <div
          className={`card p-5 group transition-colors bg-white cursor-pointer border-2 ${
            filter.difficulty === "Hard"
              ? "border-red-500 bg-red-50"
              : "border-transparent hover:border-red-500/30"
          }`}
          onClick={() => handleDifficultyFilter("Hard")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Hard</div>
          <div className="text-3xl font-bold text-red-500">{stats.hard}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter({ difficulty: "", tags: "" })}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap shadow-sm ${
            !filter.difficulty && !filter.tags
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          All Problems
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="size-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No problems found</h3>
          <p className="text-slate-500">Try adjusting your filters or check back later.</p>
        </div>
      )}

      {/* Problems List */}
      {!loading && problems.length > 0 && (
        <div className="space-y-3">
          {problems.map((problem) => (
            <Link
              key={problem._id}
              to={`/problem/${problem.slug}`}
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
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProblemsPage;
