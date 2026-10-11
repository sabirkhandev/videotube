import api from "./axios";

// Get All Liked Videos
export const getAllLikedVideosApi = async () => {
    try {
        const res = await api.get("/likes/all-liked-videos");
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load liked videos. Please try again." };
    }
};

// Toggle Video Like
export const toggleVideoLikeApi = async (videoId) => {
    try {
        const res = await api.patch(`/likes/toggle/v/like/${videoId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update video like status. Please try again." };
    }
};

// Toggle Comment Like
export const toggleCommentLikeApi = async (commentId) => {
    try {
        const res = await api.patch(`/likes/toggle/c/like/${commentId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update comment like status. Please try again." };
    }
};

// Toggle Tweet Like
export const toggleTweetLikeApi = async (tweetId) => {
    try {
        const res = await api.patch(`/likes/toggle/t/like/${tweetId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update tweet like status. Please try again." };
    }
};
