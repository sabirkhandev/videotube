import api from "./axios";

// Register User
export const registerUserApi = async (formData) => {
  try {
    const response = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to register user." };
  }
};

// Login User
export const loginUserApi = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to login user." };
  }
};

// Logout User
export const logoutUserApi = async () => {
  try {
    const response = await api.post("/users/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to logout user." };
  }
};

// Refresh Token
export const refreshTokenApi = async () => {
  try {
    const response = await api.post("/users/refresh-token");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to refresh token." };
  }
};

// Get Current User
export const getCurrentUserApi = async () => {
  try {
    const response = await api.get("/users/current-user");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user session." };
  }
};

// Change Current Password
export const changePasswordApi = async (passwordData) => {
  try {
    const response = await api.post("/users/change-password", passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password." };
  }
};

// Update Account Details (FullName, Email)
export const updateAccountDetailsApi = async (data) => {
  try {
    const response = await api.patch("/users/update-account", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update account details." };
  }
};

// Update Avatar
export const updateAvatarApi = async (formData) => {
  try {
    const response = await api.patch("/users/change-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update avatar image." };
  }
};

// Update Cover Image
export const updateCoverImageApi = async (formData) => {
  try {
    const response = await api.patch("/users/change-coverImage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update cover image." };
  }
};

// Get User Channel Profile
export const getUserChannelProfileApi = async (username) => {
  try {
    const response = await api.get(`/users/c/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch channel profile." };
  }
};

// Get Watch History
export const getWatchHistoryApi = async () => {
  try {
    const response = await api.get("/users/history");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch watch history." };
  }
};

export const clearWatchHistoryApi = async() => {
  try {
    const response = await api.patch("users/delete-history")
    return response.data ;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete watch history." }
  }
}