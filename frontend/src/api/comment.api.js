import api from "./axios";

// Get Video Comments
export const getVideoCommentsApi = async (videoId) => {
    try {
        const res = await api.get(`/comments/all/v/comments/${videoId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load comments. Please refresh the page." };
    }
};

// Add Comment
export const addCommentApi = async (videoId, content) => {
    try {
        const res = await api.post(`/comments/add-comment/${videoId}`, { content });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to post comment. Please try again." };
    }
};

// Update Comment
export const updateCommentApi = async (commentId, content) => {
    try {
        const res = await api.patch(`/comments/update-comment/${commentId}`, { content });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update comment. Please try again." };
    }
};

// Delete Comment
export const deleteCommentApi = async (commentId) => {
    try {
        const res = await api.delete(`/comments/delete-comment/${commentId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete comment. Please try again." };
    }
};
