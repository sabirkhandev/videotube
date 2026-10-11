import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const location = useLocation();

  const { status: authStatus, userData } = useSelector((state) => state.auth);

  if (!authStatus) return null;

  const username = userData?.username || "";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "My Channel", path: `/c/${username}` },
    { name: "Edit Profile", path: "/edit-profile" },
    { name: "Subscriptions", path: "/subscriptions" },
    { name: "Liked Videos", path: "/liked-videos" },
    { name: "Playlists", path: "/playlists" },
    { name: "History", path: "/history" },
    { name: "Tweets", path: "/tweets" },
  ];

  return (
    <aside className="w-full md:w-64 bg-yt-bg border-r border-yt-border md:h-[calc(100vh-56px)] md:sticky top-14 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
      <div className="flex md:flex-col gap-1 w-full">
        {/* Navigation Links */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-center gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition duration-150 ${
                isActive
                  ? "bg-yt-hover text-white font-semibold"
                  : "text-gray-300 hover:bg-yt-hover hover:text-white"
              }`}
            >
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Upload Video Button */}
        <Link
          to="/upload-video"
          className="flex items-center justify-center gap-2 px-4 py-2.5 mb-2 bg-yt-accent hover:opacity-90 text-black font-semibold rounded-xl text-sm transition duration-150 shadow-md"
        >
          <span className="text-lg">➕</span>
          <span>Upload Video</span>
        </Link>
      </div>
    </aside>
  );
}
