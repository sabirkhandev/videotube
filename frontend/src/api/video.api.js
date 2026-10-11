import api from "./axios";

// Upload New Video
export const uploadVideoApi = async (formData) => {
    try {
        const response = await api.post("/videos/upload-video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to upload video." };
    }
};

// Update Video Details (Title, Description, Thumbnail)
export const updateVideoDetailApi = async (videoId, formData) => {
    try {
        const response = await api.patch(`/videos/update-video-detail/${videoId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update video details." };
    }
};

// Get Single Video By ID
export const getVideoByIdApi = async (videoId) => {
    try {
        const response = await api.get(`/videos/get-video/${videoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch video details." };
    }
};

// Delete Video
export const deleteVideoApi = async (videoId) => {
    try {
        const response = await api.delete(`/videos/delete-video/${videoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete video." };
    }
};

// Toggle Publish Status
export const togglePublishStatusApi = async (videoId) => {
    try {
        const response = await api.patch(`/videos/publish-status/${videoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to toggle publish status." };
    }
};

// Get All Videos
export const getAllVideosApi = async (params = {}) => {
    try {
        const response = await api.get("/videos/all-videos", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch videos." };
    }
};