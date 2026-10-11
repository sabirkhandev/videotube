import api from "./axios";

// Get Channel Subscribers List
export const getChannelSubscribersApi = async (channelId) => {
    try {
        const res = await api.get(`/subscriptions/subscribers/${channelId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load subscribers list. Please try again." };
    }
};

// Get Channels Subscribed by User
export const getSubscribedChannelsApi = async (subscriberId) => {
    try {
        const res = await api.get(`/subscriptions/subscribed-channels/${subscriberId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load subscribed channels. Please refresh the page." };
    }
};

// Toggle Subscription Status (Subscribe / Unsubscribe)
export const toggleSubscriptionApi = async (channelId) => {
    try {
        const res = await api.patch(`/subscriptions/toggle-subscriptions/${channelId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update subscription status. Please try again." };
    }
};
