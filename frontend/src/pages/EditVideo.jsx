import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  updateVideoDetailApi,
  deleteVideoApi,
  togglePublishStatusApi,
} from "../api/video.api";

export default function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  // States for Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  // Operational States
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Video Detail on Load
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setPageLoading(true);
        const response = await api.get(`/videos/get-video/${videoId}`);
        if (response.data?.data) {
          const videoData = response.data.data;
          setTitle(videoData.title);
          setDescription(videoData.description);
          setIsPublished(videoData.isPublished);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load video details.",
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (videoId) fetchVideoDetails();
  }, [videoId]);

  // Update Video Details
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      await updateVideoDetailApi(videoId, formData);
      alert("Video updated successfully!");
      navigate(-1);
    } catch (err) {
      setError(err.message || "Failed to update video.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish Status
  const handleToggleStatus = async () => {
    try {
      const res = await togglePublishStatusApi(videoId);
      setIsPublished(res.data?.isPublished ?? !isPublished);
    } catch (err) {
      setError(err.message || "Failed to change video status.");
    }
  };

  // Delete Video
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteVideoApi(videoId);
      alert("Video deleted successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete video.");
    } finally {
      setDeleting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse">
          Video details are loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 text-white space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-bold">Edit Video Settings</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Publish Toggle Bar */}
        <div className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-xl">
          <div>
            <p className="text-sm font-semibold">Publishing Status</p>
            <p className="text-xs text-gray-400">
              {isPublished ? "Video is Public" : "Video is Private"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
              isPublished
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {isPublished ? "Public" : "Private"}
          </button>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1 font-medium">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2.5 bg-black border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1 font-medium">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2.5 bg-black border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1 font-medium">
              Change Thumbnail (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full text-xs text-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-800 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete Video"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-xl text-xs hover:bg-purple-700 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
