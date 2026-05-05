import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Code2, Loader2 } from "lucide-react";
import axiosInstance from "../lib/axios";
import ProblemListItem from "../components/ProblemListItem";

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [filter, setFilter] = useState({ difficulty: "", tags: "" });
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [hasMore, setHasMore] = useState(false);
  const filterDebounceRef = useRef(null);

  // Fetch stats once on mount (independent of filters)
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch problems when filter changes (with debounce)
  useEffect(() => {
    // Clear previous debounce
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }

    // Reset to page 1 when filter changes
    setPagination((prev) => ({ ...prev, page: 1 }));

    // Debounce filter changes by 300ms
    filterDebounceRef.current = setTimeout(() => {
      fetchProblems(1); // Reset to page 1
    }, 300);

    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, [filter]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await axiosInstance.get("/problems/stats");
      
      if (response.data.success) {
        const statsData = response.data.stats;
        setStats({
          total: statsData.total || 0,
          easy: statsData.easy || 0,
          medium: statsData.medium || 0,
          hard: statsData.hard || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
      };
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.tags) params.tags = filter.tags;

      const response = await axiosInstance.get("/problems", { params });
      const fetchedProblems = response.data.problems || [];
      const paginationData = response.data.pagination || {};

      if (page === 1) {
        setProblems(fetchedProblems);
      } else {
        // Append problems when loading more
        setProblems((prev) => [...prev, ...fetchedProblems]);
      }

      setPagination({
        page: paginationData.page || page,
        limit: paginationData.limit || pagination.limit,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0,
      });

      setHasMore(paginationData.page < paginationData.totalPages);
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

  const handleLoadMore = () => {
    fetchProblems(pagination.page + 1);
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-5 group transition-colors bg-white/80 backdrop-blur-sm border-2 border-slate-200">
          <div className="text-sm text-slate-500 font-medium mb-1">Total Problems</div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div
          className={`card p-5 group transition-colors cursor-pointer border-2 ${
            filter.difficulty === "Easy"
              ? "border-green-500 bg-green-50"
              : "border-transparent hover:border-green-500/30 bg-white"
          }`}
          onClick={() => handleDifficultyFilter("Easy")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Easy</div>
          <div className="text-3xl font-bold text-green-500">{stats.easy}</div>
        </div>

        <div
          className={`card p-5 group transition-colors cursor-pointer border-2 ${
            filter.difficulty === "Medium"
              ? "border-yellow-500 bg-yellow-50"
              : "border-transparent hover:border-yellow-500/30 bg-white"
          }`}
          onClick={() => handleDifficultyFilter("Medium")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Medium</div>
          <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
        </div>

        <div
          className={`card p-5 group transition-colors cursor-pointer border-2 ${
            filter.difficulty === "Hard"
              ? "border-red-500 bg-red-50"
              : "border-transparent hover:border-red-500/30 bg-white"
          }`}
          onClick={() => handleDifficultyFilter("Hard")}
        >
          <div className="text-sm text-slate-500 font-medium mb-1">Hard</div>
          <div className="text-3xl font-bold text-red-500">{stats.hard}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mb-6">
        <button
          onClick={() => setFilter({ difficulty: "", tags: "" })}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap shadow-sm ${
            !filter.difficulty && !filter.tags
              ? "bg-cyan-500 text-white"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          All Problems
        </button>
      </div>

      {/* Loading State - Initial Load */}
      {pagination.page === 1 && loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-cyan-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && pagination.page === 1 && (
        <div className="text-center py-12">
          <Code2 className="size-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No problems found</h3>
          <p className="text-slate-500">Try adjusting your filters or check back later.</p>
        </div>
      )}

      {/* Problems List */}
      {problems.length > 0 && (
        <div className="space-y-3">
          {problems.map((problem) => (
            <ProblemListItem key={problem._id} problem={problem} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex items-center justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${problems.length}/${pagination.total})`
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {problems.length > 0 && (
        <div className="text-center text-sm text-slate-500 mt-6">
          Showing {problems.length} of {pagination.total} problems
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProblemsPage;
