import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllVideosApi } from "../api/video.api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        setError("");

        const res = await getAllVideosApi({ query: query.trim() });

        const list = res.data?.docs || [];
        setVideos(list);
      } catch (err) {
        console.error("Search fetch error:", err);
        setError(
          err.message ||
            err.response?.data?.message ||
            "Search results could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse font-medium">
          Searching for "{query}"...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-xl font-bold border-b border-yt-border pb-3">
        Search Results for: <span className="text-purple-400">"{query}"</span>
      </h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!error && videos.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-yt-card border border-yt-border rounded-2xl">
           Couldn't find any video related to this.. "{query}"
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => {
            
            const owner = video.videoOwner || {};

            return (
              <Link
                key={video._id}
                to={`/watch/${video._id}`}
                className="flex flex-col sm:flex-row gap-4 bg-yt-card border border-yt-border p-3 rounded-2xl hover:border-purple-500 transition group"
              >
                <div className="sm:w-64 aspect-video bg-black rounded-xl overflow-hidden shrink-0 border border-yt-border/50">
                  <img
                    src={video.thumbnail?.replace("http://", "https://")}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                </div>

                <div className="space-y-2 flex-1 justify-between flex flex-col">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base line-clamp-2 group-hover:text-purple-400 transition">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {video.views || 0} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={
                        owner.avatar?.replace("http://", "https://") ||
                        "https://via.placeholder.com/150"
                      }
                      alt={owner.username}
                      className="w-7 h-7 rounded-full object-cover border border-yt-border"
                    />
                    <span className="text-xs text-gray-300 font-medium">
                      {owner.fullname || owner.username}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 hidden sm:block">
                    {video.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
