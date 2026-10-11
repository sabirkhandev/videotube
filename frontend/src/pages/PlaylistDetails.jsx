import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getPlaylistByIdApi,
  removeVideoFromPlaylistApi,
  deletePlaylistApi,
  updatePlaylistApi,
} from "../api/playlist.api";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.userData);

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      const res = await getPlaylistByIdApi(playlistId);
      // Postman Schema: res.data
      const data = res.data;
      setPlaylist(data);
      setEditName(data.name);
      setEditDesc(data.description || "");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not fetch playlist details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlistId) fetchPlaylistDetails();
  }, [playlistId]);

  // Remove Video from Playlist
  const handleRemoveVideo = async (videoId) => {
    try {
      await removeVideoFromPlaylistApi(videoId, playlistId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      alert("There was a problem removing the video.");
    }
  };

  // Delete Playlist
  const handleDeletePlaylist = async () => {
    if (
      !window.confirm(
        "Do you want to permanently delete this playlist?",
      )
    )
      return;
    try {
      await deletePlaylistApi(playlistId);
      navigate("/playlists");
    } catch (err) {
      alert("The playlist could not be deleted.");
    }
  };

  // Update Playlist Title/Desc
  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await updatePlaylistApi(playlistId, editName, editDesc);
      setIsEditing(false);
      fetchPlaylistDetails();
    } catch (err) {
      alert("The Playlist could not be updated.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-purple-400 animate-pulse">
        Playlist loading...
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="p-10 text-center text-red-400">
        {error || "Playlist nahi mili."}
      </div>
    );
  }

  const owner = playlist.playlistOwner || {};
  const isOwner =
    currentUser?._id === playlist.owner || currentUser?._id === owner._id;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Details */}
      <div className="bg-yt-card border border-yt-border p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
          <p className="text-sm text-gray-300 whitespace-pre-line">
            {playlist.description}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <img
              src={
                owner.avatar?.replace("http://", "https://") ||
                "https://via.placeholder.com/150"
              }
              alt={owner.username}
              className="w-8 h-8 rounded-full object-cover border border-yt-border"
            />
            <span className="text-xs text-gray-400 font-medium">
              Created by{" "}
              <strong className="text-white">@{owner.username}</strong> •{" "}
              {playlist.videos?.length || 0} Videos
            </span>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-yt-border transition cursor-pointer"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDeletePlaylist}
              className="px-4 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-400 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit Playlist Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <form
            onSubmit={handleUpdatePlaylist}
            className="bg-zinc-900 border border-yt-border rounded-2xl w-full max-w-md p-5 space-y-4"
          >
            <h3 className="font-bold text-white text-base">
              Edit Playlist Details
            </h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-black border border-yt-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <textarea
              rows="3"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-black border border-yt-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-zinc-800 text-xs rounded-xl text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-xs font-semibold rounded-xl text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Playlist Videos</h2>

        {playlist.videos?.length === 0 ? (
          <p className="text-gray-500 text-xs py-8 text-center bg-yt-card/40 border border-yt-border rounded-2xl">
            There are no videos in this playlist yet.
          </p>
        ) : (
          <div className="space-y-3">
            {playlist.videos.map((video) => (
              <div
                key={video._id}
                className="bg-yt-card border border-yt-border p-3 rounded-xl flex items-center justify-between gap-4"
              >
                <Link
                  to={`/watch/${video._id}`}
                  className="flex items-center gap-3 flex-1 overflow-hidden"
                >
                  <img
                    src={video.thumbnail?.replace("http://", "https://")}
                    alt={video.title}
                    className="w-24 h-14 object-cover rounded-lg shrink-0 border border-yt-border"
                  />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-white line-clamp-1">
                      {video.title}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {video.views || 0} views • {video.videoOwner?.fullname}
                    </p>
                  </div>
                </Link>

                {isOwner && (
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    className="px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
