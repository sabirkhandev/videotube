import api from "./axios";

// Create Tweet
export const createTweetApi = async (content) => {
    try {
        const res = await api.post("/tweets/create-tweet", { content });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create tweet. Please try again." };
    }
};

// Update Tweet
export const updateTweetApi = async (tweetId, content) => {
    try {
        const res = await api.patch(`/tweets/update-tweet/${tweetId}`, { content });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update tweet. Please try again." };
    }
};

// Delete Tweet
export const deleteTweetApi = async (tweetId) => {
    try {
        const res = await api.delete(`/tweets/delete-tweet/${tweetId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete tweet. Please try again." };
    }
};

// Get User Tweets
export const getUserTweetsApi = async (userId) => {
    try {
        const res = await api.get(`/tweets/user-tweets/${userId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load tweets. Please refresh the page." };
    }
};
