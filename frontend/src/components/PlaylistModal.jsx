import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getUserPlaylistsApi,
  createPlaylistApi,
  addVideoToPlaylistApi,
} from "../api/playlist.api";

export default function PlaylistModal({ videoId, onClose }) {
  const currentUser = useSelector((state) => state.auth?.userData);

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [addedPlaylists, setAddedPlaylists] = useState({});

  // User Playlists Fetch
  const fetchPlaylists = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const res = await getUserPlaylistsApi(currentUser._id);
      
      const list = res.data || [];
      setPlaylists(list);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [currentUser?._id]);

  // Create New Playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      await createPlaylistApi(name, description);
      setName("");
      setDescription("");
      setShowCreateForm(false);
      fetchPlaylists();
    } catch (err) {
      alert(err.response?.data?.message || "Playlist could not be created.");
    } finally {
      setCreating(false);
    }
  };

  // Add Video to Playlist
  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addVideoToPlaylistApi(videoId, playlistId);
      setAddedPlaylists((prev) => ({ ...prev, [playlistId]: true }));
    } catch (err) {
      alert(
        err.response?.data?.message || "The video could not be added to the playlist.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-900 border border-yt-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-yt-border pb-3">
          <h3 className="font-bold text-white text-base">Save to playlist</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Playlist List */}
        {loading ? (
          <p className="text-xs text-purple-400 animate-pulse text-center py-4">
            Playlists loading...
          </p>
        ) : playlists.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No playlist found.
          </p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {playlists.map((playlist) => {
              const isAdded = addedPlaylists[playlist._id];
              return (
                <div
                  key={playlist._id}
                  onClick={() => !isAdded && handleAddToPlaylist(playlist._id)}
                  className="flex items-center justify-between p-2.5 bg-black/40 hover:bg-zinc-800 rounded-xl cursor-pointer transition border border-yt-border/40"
                >
                  <span className="text-xs text-white font-medium line-clamp-1">
                    {playlist.name}
                  </span>
                  <span className="text-xs text-purple-400 font-semibold">
                    {isAdded ? "✓ Added" : "+ Add"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Toggle Create Playlist Form */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            + Create New Playlist
          </button>
        ) : (
          <form
            onSubmit={handleCreatePlaylist}
            className="space-y-3 pt-2 border-t border-yt-border"
          >
            <input
              type="text"
              placeholder="Playlist Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-yt-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <textarea
              rows="2"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-yt-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !name.trim()}
                className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
