import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSubscribedChannelsApi,
  toggleSubscriptionApi,
} from "../api/subscription.api";

export default function SubscribedChannels() {
  const currentUser = useSelector((state) => state.auth?.userData);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscribedChannels = async () => {
    if (!currentUser?._id) return;
    try {
      setLoading(true);
      const res = await getSubscribedChannelsApi(currentUser._id);

      const list = res.data?.subscribedChannelsList || [];
      setChannels(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Subscribed channels could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribedChannels();
  }, [currentUser?._id]);

  const handleToggleSub = async (channelId) => {
    try {
      await toggleSubscriptionApi(channelId);
      setChannels((prev) =>
        prev.filter((item) => item.subscribedChannelInfo?._id !== channelId),
      );
    } catch (err) {
      alert("The subscription could not be changed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p className="text-purple-500 animate-pulse font-medium">
          Subscriptions loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b border-zinc-800 pb-3">
        Subscribed Channels
      </h1>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {channels.length === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          You haven't subscribed to any channel yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.map((item) => {
            const ch = item.subscribedChannelInfo || {};
            return (
              <div
                key={item._id}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between gap-3"
              >
                <Link
                  to={`/c/${ch.username}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <img
                    src={
                      ch.avatar?.replace("http://", "https://") ||
                      "https://via.placeholder.com/150"
                    }
                    alt={ch.username}
                    className="w-12 h-12 rounded-full object-cover border border-purple-500 shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-white line-clamp-1">
                      {ch.fullname || ch.username}
                    </h3>
                    <p className="text-xs text-gray-400">@{ch.username}</p>
                  </div>
                </Link>

                <button
                  onClick={() => handleToggleSub(ch._id)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-semibold rounded-full border border-zinc-700 transition cursor-pointer"
                >
                  Subscribed
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
