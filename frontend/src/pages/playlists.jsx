import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserPlaylistsApi } from "../api/playlist.api";

export default function Playlists() {
  const currentUser = useSelector((state) => state.auth?.userData);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!currentUser?._id) return;
      try {
        setLoading(true);
        const res = await getUserPlaylistsApi(currentUser._id);
        
        setPlaylists(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Playlists load nahi ho paayi.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [currentUser?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse font-medium">
          Playlists loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b border-yt-border pb-3">
        My Playlists
      </h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {playlists.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-yt-card border border-yt-border rounded-2xl">
          You haven't created any playlists yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => {
            // First video thumbnail
            const firstVideo = playlist.videos?.[0];
            const firstThumbnail = firstVideo?.thumbnail?.replace(
              "http://",
              "https://",
            );
            const totalVideosCount =
              playlist.totalVideos || playlist.videos?.length || 0;

            return (
              <Link
                key={playlist._id}
                to={`/playlist/${playlist._id}`}
                className="bg-yt-card border border-yt-border p-3 rounded-2xl hover:border-purple-500 transition space-y-3 block group"
              >
                {/* Thumbnail Container */}
                <div className="aspect-video bg-black/80 rounded-xl overflow-hidden border border-yt-border/50 relative flex items-center justify-center">
                  {firstThumbnail ? (
                    <img
                      src={firstThumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="text-3xl text-gray-500">📁</div>
                  )}

                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                    <span>📑</span>
                    <span>
                      {totalVideosCount}{" "}
                      {totalVideosCount === 1 ? "Video" : "Videos"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-purple-400 transition">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {playlist.description || "No description provided"}
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
