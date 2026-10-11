import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAccountDetailsApi,
  changePasswordApi,
  updateAvatarApi,
  updateCoverImageApi,
} from "../api/auth.api";
import { login } from "../store/authSlice";

export default function EditProfile() {
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  // States for forms
  const [fullName, setFullName] = useState(
    user?.fullName || user?.fullname || "",
  );
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update Account Details
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await updateAccountDetailsApi({ fullname: fullName, email });
      dispatch(login(res.data));
      setMessage("Account details updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update details.");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await changePasswordApi({ oldPassword, newPassword });
      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  // Update Avatar
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    setMessage("");
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await updateAvatarApi(formData);
      dispatch(login(res.data));
      setMessage("Avatar updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update avatar.");
    } finally {
      setLoading(false);
    }
  };

  // Update Cover Image
  const handleCoverSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile) return;
    setMessage("");
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("coverImage", coverFile);
    try {
      const res = await updateCoverImageApi(formData);
      dispatch(login(res.data));
      setMessage("Cover image updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cover image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-8">
      <h1 className="text-2xl font-bold border-b border-yt-border pb-3">
        Edit Profile & Settings
      </h1>

      {message && (
        <div className="p-3 bg-green-950/50 border border-green-800 text-green-400 text-sm rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-950/50 border border-red-800 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Account Details Form */}
      <form
        onSubmit={handleUpdateDetails}
        className="bg-yt-card border border-yt-border p-5 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold text-yt-accent">
          Personal Information
        </h2>
        <div>
          <label className="block text-xs text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm"
          />
        </div>
        <button
          disabled={loading}
          className="px-4 py-2 bg-yt-accent text-black font-semibold rounded-lg text-sm"
        >
          Save Changes
        </button>
      </form>

      {/* Change Password Form */}
      <form
        onSubmit={handleChangePassword}
        className="bg-yt-card border border-yt-border p-5 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold text-yt-accent">
          Change Password
        </h2>
        <div>
          <label className="block text-xs text-gray-300 mb-1">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2.5 bg-yt-bg border border-yt-border rounded-lg text-sm"
          />
        </div>
        <button
          disabled={loading}
          className="px-4 py-2 bg-yt-accent text-black font-semibold rounded-lg text-sm"
        >
          Update Password
        </button>
      </form>

      {/* Update Avatar & Cover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handleAvatarSubmit}
          className="bg-yt-card border border-yt-border p-5 rounded-xl space-y-3"
        >
          <h2 className="text-md font-semibold text-yt-accent">
            Update Avatar
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="text-xs text-gray-300"
          />
          <button
            disabled={loading || !avatarFile}
            className="block px-4 py-2 bg-yt-accent text-black font-semibold rounded-lg text-sm disabled:opacity-50"
          >
            Upload Avatar
          </button>
        </form>

        <form
          onSubmit={handleCoverSubmit}
          className="bg-yt-card border border-yt-border p-5 rounded-xl space-y-3"
        >
          <h2 className="text-md font-semibold text-yt-accent">
            Update Cover Image
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="text-xs text-gray-300"
          />
          <button
            disabled={loading || !coverFile}
            className="block px-4 py-2 bg-yt-accent text-black font-semibold rounded-lg text-sm disabled:opacity-50"
          >
            Upload Cover
          </button>
        </form>
      </div>
    </div>
  );
}
