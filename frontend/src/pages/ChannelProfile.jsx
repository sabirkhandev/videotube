import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { getUserTweetsApi, deleteTweetApi } from "../api/tweet.api";
import { toggleSubscriptionApi } from "../api/subscription.api";
import { toggleTweetLikeApi } from "../api/like.api";
import { getUserPlaylistsApi } from "../api/playlist.api";

export default function ChannelProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const [playlists, setPlaylists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [tweetsLoading, setTweetsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.auth?.userData);

  const { userData, status: isLoggedIn } = useSelector((state) => state.auth);

  const isOwner = isLoggedIn && userData?._id === channel?._id;

  // Fetch Channel & Videos Data
  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Profile Info
        const channelRes = await api.get(`/users/c/${username}`);
        const channelData = channelRes.data?.data || channelRes.data;
        setChannel(channelData);

        // Channel Videos
        const videosRes = await api.get(
          `/videos/all-videos?userId=${channelData?._id}`,
        );
        const videoList =
          videosRes.data?.data?.docs ||
          videosRes.data?.data ||
          videosRes.data ||
          [];
        setVideos(videoList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while loading channel details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchChannelDetails();
  }, [username]);

  useEffect(() => {
    if (channel?._id) {
      getUserPlaylistsApi(channel._id)
        .then((res) => setPlaylists(res.data || []))
        .catch((err) => console.error(err));
    }
  }, [channel?._id]);

  useEffect(() => {
    if (channel) {
      setIsSubscribed(channel.isSubscribed);
      setSubscribersCount(channel.subscribersCount || 0);
    }
  }, [channel]);

  // Fetch Channel User's Tweets
  useEffect(() => {
    const fetchChannelTweets = async () => {
      if (activeTab === "tweets" && channel?._id) {
        try {
          setTweetsLoading(true);
          const res = await getUserTweetsApi(channel._id);
          const tweetList = res.data?.docs || res.data || [];
          setTweets(tweetList);
        } catch (err) {
          console.error("Tweets fetch error:", err);
        } finally {
          setTweetsLoading(false);
        }
      }
    };

    fetchChannelTweets();
  }, [activeTab, channel?._id]);

  const handleToggleTweetLike = async (tweetId) => {
  if (!isLoggedIn){
    navigate("/login");
    return ;
  }
    
  try {
    const res = await toggleTweetLikeApi(tweetId);
    const isLiked = res.data?.isLiked;

    setTweets((prevTweets) =>
      prevTweets.map((tweet) => {
        if (tweet._id === tweetId) {
          const currentLikes = tweet.likesCount || 0;
          return {
            ...tweet,
            isLiked: isLiked,
            likesCount: isLiked
              ? currentLikes + 1
              : Math.max(0, currentLikes - 1),
          };
        }
        return tweet;
      })
    );
  } catch (err) {
    alert(
      err.response?.data?.message || "Could not like the tweet."
    );
  }
};

  const handleSubscribeToggle = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      const res = await toggleSubscriptionApi(channel._id);
      const subscribedStatus = res.data?.isSubscribed;

      setIsSubscribed(subscribedStatus);
      setSubscribersCount((prev) => (subscribedStatus ? prev + 1 : prev - 1));
    } catch (err) {
      alert("There was an issue toggling the subscription.");
    }
  };

  // Delete Tweet Handler
  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Do you want to delete this tweet?")) return;

    try {
      await deleteTweetApi(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete tweet.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse font-medium">
          Channel loading...
        </p>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex justify-center items-center p-4">
        <p>{error || "Channel not Found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Banner Image */}
      <div className="w-full h-36 sm:h-52 bg-zinc-800 overflow-hidden relative">
        {channel.coverImage ? (
          <img
            src={channel.coverImage.replace("http://", "https://")}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-purple-900 to-zinc-900" />
        )}
      </div>

      {/* Header Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                channel.avatar?.replace("http://", "https://") ||
                "https://via.placeholder.com/150"
              }
              alt={channel.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-500 shadow-xl"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold">
                {channel.fullname || channel.username}
              </h1>
              <p className="text-xs text-gray-400">
                @{channel.username} • {subscribersCount} subscribers
              </p>
              <p className="text-xs text-gray-300 line-clamp-1">
                {channel.description || "Welcome to my channel!"}
              </p>
            </div>
          </div>

          <div>
            {isOwner ? (
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSubscribeToggle}
                className={`px-5 py-2 rounded-full font-semibold text-xs transition cursor-pointer ${
                  isSubscribed
                    ? "bg-zinc-800 text-gray-300 border border-zinc-700 hover:bg-zinc-700"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-yt-border gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-3 ${activeTab === "videos" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"}`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab("tweets")}
            className={`pb-3 ${activeTab === "tweets" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"}`}
          >
            Tweets
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`pb-3 ${activeTab === "playlists" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"}`}
          >
            Playlists
          </button>
        </div>

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="pt-4">
            {videos.length === 0 ? (
              <div className="p-10 text-center text-gray-400 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
                <p className="text-base font-medium">
                  No video has been uploaded.
                </p>
                {isOwner && (
                  <button
                    onClick={() => navigate("/upload-video")}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white text-xs rounded-xl hover:bg-purple-700 transition cursor-pointer"
                  >
                    Upload Video
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
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
                      <div className="p-3 space-y-1">
                        <Link to={`/watch/${video._id}`}>
                          <h3 className="font-semibold text-white text-sm line-clamp-2 hover:text-purple-400 transition">
                            {video.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-400">
                          {video.views || 0} views •{" "}
                          {video.isPublished ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="p-3 pt-0">
                        <button
                          onClick={() => navigate(`/edit-video/${video._id}`)}
                          className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-white font-medium rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>✏️</span>
                          <span>Edit Video</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tweets Tab Content */}
        {activeTab === "tweets" && (
  <div className="pt-4 max-w-2xl mx-auto space-y-4">
    {tweetsLoading ? (
      <p className="text-center text-purple-400 py-8 animate-pulse text-sm">
        Tweets are loading...
      </p>
    ) : tweets.length === 0 ? (
      <div className="p-10 text-center text-gray-400 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        This user has not posted any tweets yet.
      </div>
    ) : (
      tweets.map((tweet) => {
        const isOwner = currentUser?._id === tweet.owner?._id || currentUser?._id === channel?._id;

        return (
          <div
            key={tweet._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    channel.avatar?.replace("http://", "https://") ||
                    "https://via.placeholder.com/150"
                  }
                  alt={channel.username}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {channel.fullname || channel.username}
                  </h4>
                  <p className="text-xs text-gray-400">
                    @{channel.username} •{" "}
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Owner Delete Button */}
              {isOwner && (
                <button
                  onClick={() => handleDeleteTweet(tweet._id)}
                  className="text-xs text-gray-400 hover:text-red-400 transition cursor-pointer"
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            <p className="text-sm text-gray-200 whitespace-pre-line">
              {tweet.content}
            </p>

            {/* Interactive Like Button for Logged-in Users */}
            <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/60 text-xs">
              <button
                onClick={() => handleToggleTweetLike(tweet._id)}
                className={`flex items-center gap-1.5 transition cursor-pointer font-medium ${
                  tweet.isLiked
                    ? "text-red-500 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>{tweet.isLiked ? "❤️" : "🤍"}</span>
                <span>{tweet.likesCount || 0} Likes</span>
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>
        )}

        {/* Playlist Tab */}
        {activeTab === "playlists" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
            {playlists.length === 0 ? (
              <p className="text-xs text-gray-500 col-span-full text-center py-6">
                No playlist found.
              </p>
            ) : (
              playlists.map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="bg-yt-card border border-yt-border p-4 rounded-2xl hover:border-purple-500 transition space-y-2 block"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-sm line-clamp-1">
                      {playlist.name}
                    </h3>
                    <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-800">
                      {playlist.totalVideos || playlist.videos?.length || 0}{" "}
                      Videos
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {playlist.description || "No description"}
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
