import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCurrentUserApi } from "./api/auth.api";
import { login, logout } from "./store/authSlice";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import ChannelProfile from "./pages/ChannelProfile"
import WatchHistory from "./pages/WatchHistory"
import WatchVideo from "./pages/WatchVideo";
import UploadVideo from "./pages/UploadVideo";
import EditVideo from "./pages/EditVideo";
import Tweets from "./pages/Tweets";
import SubscribedChannels from "./pages/SubscribedChannels";
import LikedVideos from "./pages/LikedVideos";
import PlaylistDetails from "./pages/PlaylistDetails";
import Playlists from "./pages/playlists";
import SearchResults from "./pages/SearchResults";


export default function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getCurrentUserApi()
            .then((response) => {
                if (response?.data) {
                    dispatch(login(response.data));
                } else {
                    dispatch(logout());
                }
            })
            .catch(() => {
                dispatch(logout());
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-yt-bg flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-yt-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400">Loading VideoTube...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-yt-bg text-white flex flex-col">
                {/* Fixed Top Navbar */}
                <Navbar />

                {/* Main Body Layout: Left Sidebar + Right Page Content */}
                <div className="flex flex-col md:flex-row flex-1">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/c/:username" element={<ChannelProfile />} />
            <Route path="/history" element={<WatchHistory />} />
            <Route path="/watch/:videoId" element={<WatchVideo />} />
            <Route path="/upload-video" element={<UploadVideo />} />
            <Route path="/edit-video/:videoId" element={<EditVideo />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="/subscriptions" element={<SubscribedChannels />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
            <Route path="/playlists" element={<Playlists />} />

            <Route path="*" element={<div className="p-10 text-center text-gray-400">404 - Page Not Found</div>} />
        </Routes>
    </main>
</div>
            </div>
        </Router>
    );
}