import api from "./axios";

// Create Playlist
export const createPlaylistApi = async (name, description) => {
    try {
        const res = await api.post("/playlists/create-playlist", { name, description });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create playlist. Please try again." };
    }
};

// Add Video to Playlist
export const addVideoToPlaylistApi = async (videoId, playlistId) => {
    try {
        const res = await api.patch(`/playlists/add/v/playlist/${videoId}/${playlistId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add video to playlist. Please try again." };
    }
};

// Update Playlist Details
export const updatePlaylistApi = async (playlistId, name, description) => {
    try {
        const res = await api.patch(`/playlists/update-playlist/${playlistId}`, { name, description });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update playlist details. Please try again." };
    }
};

// Delete Playlist
export const deletePlaylistApi = async (playlistId) => {
    try {
        const res = await api.delete(`/playlists/delete-playlist/${playlistId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete playlist. Please try again." };
    }
};

// Get Single Playlist Details by ID
export const getPlaylistByIdApi = async (playlistId) => {
    try {
        const res = await api.get(`/playlists/playlist/${playlistId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load playlist details. Please refresh the page." };
    }
};

// Get All Playlists of a Specific User
export const getUserPlaylistsApi = async (userId) => {
    try {
        const res = await api.get(`/playlists/user-playlist/${userId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load user playlists. Please try again." };
    }
};

// Remove Video from Playlist
export const removeVideoFromPlaylistApi = async (videoId, playlistId) => {
    try {
        const res = await api.patch(`/playlists/remove/v/playlist/${videoId}/${playlistId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to remove video from playlist. Please try again." };
    }
};
