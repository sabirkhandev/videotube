import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllLikedVideosApi } from "../api/like.api";

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const res = await getAllLikedVideosApi();

        const list = res.data?.likedVideos || [];
        setLikedVideos(list);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while loading liked videos.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse font-medium">
          Liked videos loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b border-zinc-800 pb-3">
        Liked Videos
      </h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {likedVideos.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          You haven't liked any videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedVideos.map((item) => {
            const video = item.likedVideosDetails || {};
            const owner = video.ownerDetails || {};

            return (
              <div
                key={item._id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <Link
                  to={`/watch/${video._id}`}
                  className="block aspect-video bg-black overflow-hidden relative"
                >
                  <img
                    src={video.thumbnail?.replace("http://", "https://")}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                </Link>

                <div className="p-3 space-y-2">
                  <Link to={`/watch/${video._id}`}>
                    <h3 className="font-semibold text-white text-sm line-clamp-2 hover:text-purple-400 transition">
                      {video.title}
                    </h3>
                  </Link>

                  <Link
                    to={`/c/${owner.username}`}
                    className="flex items-center gap-2 pt-1"
                  >
                    <img
                      src={
                        owner.avatar?.replace("http://", "https://") ||
                        "https://via.placeholder.com/150"
                      }
                      alt={owner.username}
                      className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                    />
                    <span className="text-xs text-gray-400 line-clamp-1">
                      {owner.fullname || owner.username}
                    </span>
                  </Link>

                  <p className="text-[11px] text-gray-500">
                    {video.views || 0} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
