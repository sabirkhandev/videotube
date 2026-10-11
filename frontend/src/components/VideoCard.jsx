import React from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  if (!video) return null;

  const owner = video.videoOwner || video.owner;

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views || 0;
  };

  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      {/* Thumbnail */}
      <Link
        to={`/watch/${video._id}`}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-yt-hover"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-medium">
            {Math.floor(video.duration / 60)}:
            {Math.floor(video.duration % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        )}
      </Link>
      {/* Video Info */}
      <div className="flex gap-3 items-start mt-1">
        {/* Channel Avatar */}
        <Link to={`/c/${owner?.username}`}>
          <img
            src={owner?.avatar || "https://via.placeholder.com/150"}
            alt={owner?.username}
            className="w-9 h-9 rounded-full object-cover border border-yt-border"
          />
        </Link>
        {/* Details */}
        <div className="flex flex-col">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-yt-accent transition">
              {video.title}
            </h3>
          </Link>

          <Link
            to={`/c/${owner?.username}`}
            className="text-gray-400 text-xs hover:text-white mt-1"
          >
            {owner?.fullname || owner?.username}
          </Link>

          <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>
              {video.createdAt
                ? new Date(video.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
