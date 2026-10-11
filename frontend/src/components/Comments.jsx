import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getVideoCommentsApi,
  addCommentApi,
  updateCommentApi,
  deleteCommentApi,
} from "../api/comment.api";
import { toggleCommentLikeApi } from "../api/like.api";

export default function Comments({ videoId }) {
  const currentUser = useSelector((state) => state.auth?.userData);

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  // Edit Comment States
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch Video Comments
  const fetchComments = async () => {
    if (!videoId) return;
    try {
      setLoading(true);
      const res = await getVideoCommentsApi(videoId);
      const commentList = res.data?.docs || [];
      setComments(commentList);
    } catch (err) {
      setError(err.response?.data?.message || "Error in loading comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!currentUser) return alert("Login first for comment.");

    try {
      setPosting(true);
      setError("");
      await addCommentApi(videoId, content);
      setContent("");
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || "Comment does not posted");
    } finally {
      setPosting(false);
    }
  };

  // Start Editing
  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  // Update Comment
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      setUpdating(true);
      await updateCommentApi(commentId, editContent);
      setEditingCommentId(null);
      setEditContent("");
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Error in updating comment");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Do you want to delete this comment?")) return;

    try {
      await deleteCommentApi(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Comment could not be deleted.");
    }
  };

  // Toggle Comment Like Handler
  const handleToggleCommentLike = async (commentId) => {
    if (!currentUser) return alert("Login first to like comments.");

    try {
      const res = await toggleCommentLikeApi(commentId);

      const isLiked = res.data?.isLiked;

      setComments((prevComments) =>
        prevComments.map((item) => {
          if (item._id === commentId) {
            const currentLikes = item.likesCount || 0;
            return {
              ...item,
              isLiked: isLiked,
              likesCount: isLiked
                ? currentLikes + 1
                : Math.max(0, currentLikes - 1),
            };
          }
          return item;
        }),
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Like status of comment not changed.",
      );
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-yt-border">
      <h2 className="text-lg font-bold text-white">
        Comments ({comments.length})
      </h2>

      {error && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Add Comment Input Form */}
      {currentUser && (
        <form onSubmit={handleAddComment} className="flex gap-3 items-start">
          <img
            src={
              currentUser.avatar?.replace("http://", "https://") ||
              "https://via.placeholder.com/150"
            }
            alt={currentUser.username}
            className="w-10 h-10 rounded-full object-cover border border-yt-border shrink-0"
          />
          <div className="flex-1 space-y-2">
            <textarea
              rows="2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ek public comment add karein..."
              className="w-full bg-yt-card border border-yt-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              {content.trim() && (
                <button
                  type="button"
                  onClick={() => setContent("")}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={posting || !content.trim()}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs rounded-full transition cursor-pointer"
              >
                {posting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-xs text-purple-400 animate-pulse text-center py-4">
          Comments loading...
        </p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">
          No Comments Found!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const owner = comment.commentOwner || {};
            const isOwner = currentUser?._id === owner._id;

            return (
              <div
                key={comment._id}
                className="flex items-start gap-3 bg-yt-card/40 p-3 rounded-xl border border-yt-border/50"
              >
                <img
                  src={
                    owner.avatar?.replace("http://", "https://") ||
                    "https://via.placeholder.com/150"
                  }
                  alt={owner.username}
                  className="w-9 h-9 rounded-full object-cover border border-yt-border shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        @{owner.username}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Owner Edit / Delete Controls */}
                    {isOwner && editingCommentId !== comment._id && (
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-gray-400 hover:text-purple-400 transition cursor-pointer"
                          title="Edit Comment"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-400 hover:text-red-400 transition cursor-pointer"
                          title="Delete Comment"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Edit Box or Regular Content */}
                  {editingCommentId === comment._id ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows="2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 bg-black border border-yt-border rounded-lg text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-[11px] rounded-lg transition cursor-pointer text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={updating}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-[11px] font-semibold rounded-lg transition cursor-pointer text-white"
                        >
                          {updating ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-200 whitespace-pre-line">
                      {comment.content}
                    </p>
                  )}

                  {/* Like Button Row */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleToggleCommentLike(comment._id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition cursor-pointer ${
                        comment.isLiked
                          ? "text-red-500 font-bold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{comment.isLiked ? "❤️" : "🤍"}</span>
                      <span>{comment.likesCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
