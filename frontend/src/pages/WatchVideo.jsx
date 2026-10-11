import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getVideoByIdApi } from "../api/video.api";
import { toggleSubscriptionApi } from "../api/subscription.api";
import Comments from "../components/Comments";
import { toggleVideoLikeApi } from "../api/like.api";
import PlaylistModal from "../components/PlaylistModal";

export default function WatchVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.userData);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCountState, setSubscribersCountState] = useState(0);

  const [isLikedState, setIsLikedState] = useState(false);
  const [likesCountState, setLikesCountState] = useState(0);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await getVideoByIdApi(videoId);
        const videoData = res.data?.data || res.data;
        setVideo(videoData);

        // State Initial Sync
        const owner = videoData?.videoOwner || videoData?.owner;
        setSubscribed(videoData?.isSubscribed || owner?.isSubscribed || false);
        setSubscribersCountState(
          videoData?.subscribersCount || owner?.subscribersCount || 0,
        );
      } catch (err) {
        setError(err.message || "Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (video) {
      setIsLikedState(video.isLiked || false);
      setLikesCountState(video.likesCount || 0);
    }
  }, [video]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading video player...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-400">{error}</div>;
  }

  if (!video) {
    return (
      <div className="p-10 text-center text-gray-400">Video not found.</div>
    );
  }

  const { _id, videoFile, title, description, views, videoOwner } = video;

  const owner = videoOwner || video.owner;

  // Toggle Subscription Handler
  const handleToggleSubscription = async () => {
    if (!currentUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    if (!owner?._id) return;

    try {
      const res = await toggleSubscriptionApi(owner._id);
      const newSubscribedStatus = res.data?.isSubscribed;

      setSubscribed(newSubscribedStatus);
      setSubscribersCountState((prev) =>
        newSubscribedStatus ? prev + 1 : Math.max(0, prev - 1),
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Subscription status could not be updated.",
      );
    }
  };

  // Toggle Video Like Handler
  const handleToggleVideoLike = async () => {
    if (!currentUser) {
      alert("Please log in first to like.");
      navigate("/login");
      return;
    }
    try {
      const res = await toggleVideoLikeApi(_id);
      const likedStatus = res.data?.isLike;

      setIsLikedState(likedStatus);
      setLikesCountState((prev) =>
        likedStatus ? prev + 1 : Math.max(0, prev - 1),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Like could not be updated.");
    }
  };

  // Save to Playlist Handler
  const handleSaveToPlaylist = () => {
    if (!currentUser) {
      alert("Please login first to save video in playlist.");
      navigate("/login");
      return;
    }
    setShowPlaylistModal(true);
  };

  const isOwner =
    currentUser &&
    (currentUser._id === owner?._id ||
      currentUser.username === owner?.username);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      {/* Player */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-yt-border shadow-lg">
        <video
          src={videoFile?.replace("http://", "https://")}
          controls
          autoPlay
          controlsList="nodownload"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>

      {/* Channel Info & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bpayaorder-b border-yt-border pb-4">
        <Link to={`/c/${owner?.username}`} className="flex items-center gap-3">
          <img
            src={
              owner?.avatar?.replace("http://", "https://") ||
              "https://via.placeholder.com/150"
            }
            alt={owner?.username}
            className="w-11 h-11 rounded-full object-cover border border-yt-border"
          />
          <div>
            <h3 className="font-semibold text-white text-sm">
              {owner?.fullname || owner?.username}
            </h3>
            <p className="text-xs text-gray-400">
              @{owner?.username} • {subscribersCountState || 0} subscribers
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveToPlaylist}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-yt-card hover:bg-yt-hover text-white border border-yt-border transition cursor-pointer"
          >
            <span>📑</span> Save
          </button>
          <button
            onClick={handleToggleVideoLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
              isLikedState
                ? "bg-white text-black"
                : "bg-yt-card text-white hover:bg-yt-hover border border-yt-border"
            }`}
          >
            <span>👍</span>
            <span>{likesCountState}</span>
          </button>

          {isOwner ? (
            <button
              onClick={() => navigate(`/edit-video/${_id}`)}
              className="px-4 py-2 bg-yt-card hover:bg-yt-hover text-white border border-yt-border rounded-full text-xs font-semibold transition cursor-pointer"
            >
              ✏️ Edit Video
            </button>
          ) : (
            <button
              onClick={handleToggleSubscription}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
                subscribed
                  ? "bg-yt-card text-gray-300 border border-yt-border hover:bg-yt-hover"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/* Video Description Box */}
      <div className="bg-yt-card border border-yt-border p-4 rounded-xl space-y-2">
        <div className="text-xs text-gray-400 flex gap-2 font-medium">
          <span>{views || 0} views</span>
        </div>
        <p className="text-sm text-gray-200 whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* COMMENTS SECTION */}
      <Comments videoId={_id} />
      {showPlaylistModal && (
        <PlaylistModal
          videoId={_id}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}
