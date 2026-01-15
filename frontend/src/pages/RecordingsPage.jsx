import { useUser } from "@clerk/clerk-react";
import { ClockIcon, PlayCircleIcon, Loader2Icon, VideoIcon, CalendarIcon, UserIcon, RefreshCwIcon, Trash2Icon, Search, Filter } from "lucide-react";
import { useRecordings } from "../hooks/useRecordings";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import { useState, useMemo } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const DIFFICULTY_COLORS = {
  easy: "text-green-600 bg-green-50 border-green-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  hard: "text-red-600 bg-red-50 border-red-200",
};

function RecordingsPage() {
  const { user } = useUser();
  const { data, isLoading, error, refetch } = useRecordings();
  const [refreshingId, setRefreshingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-recent");

  // Backend returns { recordings: [...] }
  const allRecordings = data?.recordings || [];

  // Filter and sort recordings
  const recordings = useMemo(() => {
    let filtered = [...allRecordings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(rec =>
        rec.problemTitle?.toLowerCase().includes(query) ||
        rec.difficulty?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "most-recent":
          return new Date(b.startedAt) - new Date(a.startedAt);
        case "oldest":
          return new Date(a.startedAt) - new Date(b.startedAt);
        case "longest":
          return (b.duration || 0) - (a.duration || 0);
        case "shortest":
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allRecordings, searchQuery, sortBy]);

  console.log("Recordings data:", data);
  console.log("Recordings array:", recordings);

  const handleRefresh = async (recordingId) => {
    setRefreshingId(recordingId);
    try {
      const response = await axiosInstance.post(`/recordings/${recordingId}/refresh`);
      toast.success("Recording is ready! Click Watch Recording.");
      // Refresh the list
      await refetch();
    } catch (error) {
      console.error("Refresh error:", error);
      const errorMsg = error.response?.data?.message || "Failed to refresh";
      
      if (error.response?.status === 404) {
        toast.error("⚠️ Recording not found on Stream. Recording may have failed to start. Check Stream Dashboard settings.");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setRefreshingId(null);
    }
  };

  const handleDelete = async (recordingId, problemTitle) => {
    if (!window.confirm(`Delete recording for "${problemTitle}"?`)) {
      return;
    }

    setDeletingId(recordingId);
    try {
      await axiosInstance.delete(`/recordings/${recordingId}`);
      toast.success("Recording deleted successfully");
      await refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete recording");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <PageHeader title="Recorded Sessions" subtitle="Watch your past coding sessions" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by problem name or difficulty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="most-recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="longest">Longest Duration</option>
              <option value="shortest">Shortest Duration</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="size-12 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <VideoIcon className="size-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Error Loading Recordings</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {error?.message || "Failed to load recordings. Please try again."}
            </p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <VideoIcon className="size-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">No Recordings Yet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Start a session and click "Start Recording" to save your coding sessions for later review.
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Debug: Loaded {recordings.length} recordings
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <div key={recording._id} className="card hover:shadow-xl transition-shadow">
                {/* Thumbnail / Preview */}
                <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 rounded-t-xl overflow-hidden">
                  {recording.status === "ready" && recording.recordingUrl ? (
                    <video
                      src={recording.recordingUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  ) : recording.status === "processing" ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2Icon className="size-10 animate-spin text-white mb-2 mx-auto" />
                        <p className="text-white text-sm">Processing...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoIcon className="size-16 text-white/30" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  {recording.status === "ready" && recording.recordingUrl && (
                    <a
                      href={recording.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity group"
                    >
                      <PlayCircleIcon className="size-16 text-white group-hover:scale-110 transition-transform" />
                    </a>
                  )}

                  {/* Duration Badge */}
                  {recording.duration && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                      <ClockIcon className="size-3" />
                      {formatDuration(recording.duration)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">
                    {recording.problemTitle || "Untitled Session"}
                  </h3>

                  {/* Difficulty Badge */}
                  {recording.difficulty && (
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border mb-3 ${
                        DIFFICULTY_COLORS[recording.difficulty.toLowerCase()] || DIFFICULTY_COLORS.medium
                      }`}
                    >
                      {recording.difficulty}
                    </span>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-slate-400" />
                      <span>{formatDate(recording.startedAt)}</span>
                    </div>

                    {recording.participant && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="size-4 text-slate-400" />
                        <span>
                          with {recording.participant?.name || recording.participant?.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {recording.status === "ready" && recording.recordingUrl ? (
                      <a
                        href={recording.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                      >
                        <PlayCircleIcon className="size-4" />
                        Watch Recording
                      </a>
                    ) : recording.status === "processing" ? (
                      <button
                        onClick={() => handleRefresh(recording._id)}
                        disabled={refreshingId === recording._id}
                        className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {refreshingId === recording._id ? (
                          <>
                            <Loader2Icon className="size-4 animate-spin" />
                            Checking Stream...
                          </>
                        ) : (
                          <>
                            <RefreshCwIcon className="size-4" />
                            Check if Ready
                          </>
                        )}
                      </button>
                    ) : null}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(recording._id, recording.problemTitle)}
                      disabled={deletingId === recording._id}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="Delete recording"
                    >
                      {deletingId === recording._id ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RecordingsPage;
