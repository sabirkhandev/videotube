import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideoApi } from "../api/video.api";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Title and description fields are required.");
      return;
    }

    if (!videoFile || !thumbnail) {
      setError("Please select both a video file and a thumbnail image.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      const res = await uploadVideoApi(formData);
      setMessage("Video uploaded successfully!");

      // Redirect to watch page on successful upload
      setTimeout(() => {
        const videoId = res.data?._id || res.data?.video?._id;
        if (videoId) {
          navigate(`/watch/${videoId}`);
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "An error occurred while uploading the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold border-b border-yt-border pb-3 mb-6">
        Upload New Video
      </h1>

      {message && (
        <div className="p-3 mb-4 bg-green-950/50 border border-green-800 text-green-400 text-sm rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-yt-card border border-yt-border p-6 rounded-xl space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-xs text-gray-300 mb-1 font-medium">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm focus:outline-none focus:border-yt-accent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-gray-300 mb-1 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="4"
            placeholder="Tell viewers about your video"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm focus:outline-none focus:border-yt-accent resize-none"
          />
        </div>

        {/* Video File Upload */}
        <div>
          <label className="block text-xs text-gray-300 mb-1 font-medium">
            Video File (.mp4, .mkv) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yt-hover file:text-white hover:file:bg-yt-border cursor-pointer"
          />
        </div>

        {/* Thumbnail Image Upload */}
        <div>
          <label className="block text-xs text-gray-300 mb-1 font-medium">
            Thumbnail Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
            className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yt-hover file:text-white hover:file:bg-yt-border cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yt-accent text-black font-semibold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading video...</span>
            </>
          ) : (
            "Upload Video"
          )}
        </button>
      </form>
    </div>
  );
}
