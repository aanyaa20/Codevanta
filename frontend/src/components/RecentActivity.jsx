import { useState, useEffect } from "react";
import { CheckCircle, Code2, Clock } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";

function RecentActivity() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  const fetchRecentSubmissions = async () => {
    try {
      const response = await axiosInstance.get("/submissions/recent");
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-8 flex justify-center bg-white">
        <div className="size-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="card p-8 text-center space-y-4 bg-white">
        <div className="size-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center">
          <Code2 className="size-8 text-slate-300" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">No solved problems yet</p>
          <p className="text-sm text-slate-500">
            Start solving problems to see your progress here.
          </p>
        </div>
        <button
          onClick={() => navigate("/problems")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Start Solving
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className="group flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-green-200 hover:bg-green-50/10 transition-all cursor-pointer"
          onClick={() => navigate(`/problem/${submission.problemSlug}`)}
        >
          <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-green-50 text-green-600">
            <CheckCircle className="size-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-slate-900 truncate group-hover:text-green-600 transition-colors">
                {submission.problemId?.title || "Problem"}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyBadgeClass(
                  submission.problemId?.difficulty
                )}`}
              >
                {submission.problemId?.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </span>
              <span>•</span>
              <span className="uppercase font-medium">{submission.language}</span>
              {submission.runtime && (
                <>
                  <span>•</span>
                  <span>{submission.runtime.toFixed(0)}ms</span>
                </>
              )}
            </div>
          </div>

          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
            Accepted
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;
