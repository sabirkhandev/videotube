import React, { useEffect, useState } from "react";
import { getAllVideosApi } from "../api/video.api.js";
import VideoCard from "../components/VideoCard.jsx";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // videos fetch on page loading
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getAllVideosApi();
        setVideos(
          response?.data?.docs ||
            response?.data?.videos ||
            response?.data ||
            [],
        );
      } catch (err) {
        setError(err.message || "Failed to fetch videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Loading State (Skeleton Grid)
  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="w-full aspect-video bg-yt-hover rounded-xl"></div>
            <div className="flex gap-3 mt-2">
              <div className="w-9 h-9 bg-yt-hover rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-yt-hover rounded w-5/6"></div>
                <div className="h-3 bg-yt-hover rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-400">
        <p className="bg-red-950/40 border border-red-800 px-6 py-4 rounded-xl text-center">
          {error}
        </p>
      </div>
    );
  }

  // 3. Empty State (No videos found)
  if (videos.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-2">
        <span className="text-4xl">📹</span>
        <p className="text-lg font-medium">No videos found</p>
        <p className="text-xs text-gray-500">
          Be the first one to upload a video!
        </p>
      </div>
    );
  }

  // Success State (Render Video Grid)
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
