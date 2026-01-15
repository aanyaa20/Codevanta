import { Check, X, Loader2Icon, Clock } from "lucide-react";

const LANGUAGE_CONFIG = {
  javascript: { label: "JavaScript" },
  python: { label: "Python" },
  c: { label: "C" },
  cpp: { label: "C++" },
  java: { label: "Java" },
};

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-50 border-green-300 text-green-800";
    case "Wrong Answer":
      return "bg-red-50 border-red-300 text-red-800";
    case "Runtime Error":
      return "bg-orange-50 border-orange-300 text-orange-800";
    case "Time Limit Exceeded":
      return "bg-yellow-50 border-yellow-300 text-yellow-800";
    case "Compilation Error":
      return "bg-purple-50 border-purple-300 text-purple-800";
    default:
      return "bg-slate-50 border-slate-300 text-slate-800";
  }
};

function SubmissionsPanel({ submissions, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon className="size-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="size-12 mx-auto mb-3 text-slate-300" />
        <p className="text-slate-500 font-medium">No submissions yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Submit your first solution to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className={`p-4 border rounded-lg transition-all hover:shadow-md ${getStatusColor(
            submission.status
          )}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {submission.status === "Accepted" ? (
                <Check className="size-5" />
              ) : (
                <X className="size-5" />
              )}
              <span className="font-semibold">{submission.status}</span>
            </div>
            <span className="text-xs">
              {new Date(submission.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong>Language:</strong> {LANGUAGE_CONFIG[submission.language]?.label || submission.language}
            </span>
            <span>
              <strong>Test Cases:</strong> {submission.testCasesPassed}/{submission.totalTestCases}
            </span>
          </div>
          {submission.errorMessage && (
            <div className="mt-2 text-xs bg-white/50 p-2 rounded border border-current">
              <strong>Error:</strong> {submission.errorMessage}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SubmissionsPanel;
