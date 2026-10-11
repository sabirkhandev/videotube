import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchHistoryApi, clearWatchHistoryApi } from "../api/auth.api";

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  // Watch history fetch
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getWatchHistoryApi();
      setHistory(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message || "Watch history could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // watch history clear
  const handleClearHistory = async () => {
    if (!window.confirm("Do you really want to clear your history?")) {
      return;
    }

    try {
      setClearing(true);
      await clearWatchHistoryApi();
      setHistory([]);
    } catch (err) {
      alert(err.message || "Error while clearing history.");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Watch history is loading...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-white">
      {/* Header section with Clear History Button */}
      <div className="flex items-center justify-between border-b border-yt-border pb-4">
        <div>
          <h1 className="text-2xl font-bold">Watch History</h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-800/50 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition disabled:opacity-50 cursor-pointer"
          >
            <span>🗑️</span>
            <span>{clearing ? "Clearing..." : "Clear All History"}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Watch History List */}
      {history.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-yt-card border border-yt-border rounded-xl space-y-2">
          <p className="text-lg font-medium">Your watch history is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((video) => {
            const owner = video.videoOwner || video.owner;
            return (
              <div
                key={video._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-yt-card border border-yt-border p-3 rounded-xl hover:border-gray-700 transition group"
              >
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {/* Video Thumbnail */}
                  <Link
                    to={`/watch/${video._id}`}
                    className="shrink-0 w-full sm:w-48 aspect-video bg-black rounded-lg overflow-hidden border border-yt-border relative"
                  >
                    <img
                      src={video.thumbnail?.replace("http://", "https://")}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  </Link>

                  {/* Video Details */}
                  <div className="flex flex-col justify-between py-1 space-y-2">
                    <div>
                      <Link to={`/watch/${video._id}`}>
                        <h3 className="font-semibold text-white text-base line-clamp-2 hover:text-yt-accent transition">
                          {video.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        {video.views || 0} views
                      </p>
                    </div>

                    {/* Owner Info */}
                    {owner && (
                      <Link
                        to={`/c/${owner.username}`}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={
                            owner.avatar?.replace("http://", "https://") ||
                            "https://via.placeholder.com/150"
                          }
                          alt={owner.username}
                          className="w-6 h-6 rounded-full object-cover border border-yt-border"
                        />
                        <span className="text-xs text-gray-300 font-medium hover:text-white">
                          {owner.fullname || owner.username}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
