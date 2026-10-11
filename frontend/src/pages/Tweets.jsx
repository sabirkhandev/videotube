import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createTweetApi,
  getUserTweetsApi,
  deleteTweetApi,
} from "../api/tweet.api";
import { toggleTweetLikeApi } from "../api/like.api";

export default function Tweets() {
  const currentUser = useSelector((state) => state.auth?.userData);

  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Current User Tweets
  const fetchTweets = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const res = await getUserTweetsApi(currentUser._id);
      const tweetList = res.data?.docs || res.data || [];
      setTweets(tweetList);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tweets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [currentUser?._id]);

  // Post New Tweet
  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setPosting(true);
      setError("");
      await createTweetApi(content);
      setContent("");
      fetchTweets();
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while posting the tweet.",
      );
    } finally {
      setPosting(false);
    }
  };

  // Delete Tweet
  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Do you want to delete this tweet?"))
      return;

    try {
      await deleteTweetApi(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      alert(err.response?.data?.message || "The tweet could not be deleted.");
    }
  };

  // Toggle Tweet Like Handler 
  const handleToggleTweetLike = async (tweetId) => {
    if (!currentUser)
      return alert("Please log in first to like the tweet.");

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
        }),
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "The tweet could not be posted.",
      );
    }
  };

  if (!currentUser) {
    return (
      <div className="p-10 text-center text-gray-400">
        Log in first to view or post tweets.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white border-b border-yt-border pb-3">
        Tweets / Posts
      </h1>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Create Tweet Form */}
      <form
        onSubmit={handleCreateTweet}
        className="bg-yt-card border border-yt-border p-4 rounded-2xl space-y-3"
      >
        <textarea
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind ? write here..."
          className="w-full bg-black/50 border border-yt-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs rounded-full transition cursor-pointer"
          >
            {posting ? "Posting..." : "Tweet"}
          </button>
        </div>
      </form>

      {/* Tweet List */}
      {loading ? (
        <p className="text-center text-purple-400 animate-pulse text-sm py-6">
          Tweets loading...
        </p>
      ) : tweets.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-yt-card/50 border border-yt-border rounded-2xl">
          You haven't posted any tweets yet.
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => {
            const owner = tweet.tweetOwner || currentUser;
            const isOwner = currentUser?._id === owner?._id;

            return (
              <div
                key={tweet._id}
                className="bg-yt-card border border-yt-border p-4 rounded-2xl space-y-3"
              >
                {/* Owner Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        owner.avatar?.replace("http://", "https://") ||
                        "https://via.placeholder.com/150"
                      }
                      alt={owner.username}
                      className="w-10 h-10 rounded-full object-cover border border-yt-border shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {owner.fullname || owner.username}
                      </h3>
                      <p className="text-xs text-gray-400">
                        @{owner.username} •{" "}
                        {new Date(tweet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleDeleteTweet(tweet._id)}
                      className="text-xs text-gray-400 hover:text-red-400 transition cursor-pointer"
                      title="Delete Tweet"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-gray-200 whitespace-pre-line pl-1">
                  {tweet.content}
                </p>

                {/* Like Toggle */}
                <div className="flex items-center gap-4 pt-2 border-t border-yt-border/50 text-xs">
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
          })}
        </div>
      )}
    </div>
  );
}
