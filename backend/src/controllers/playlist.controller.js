import { Playlist } from "../models/playlist.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim()) {
        throw new apiError(400, "Name and Description both are required");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        videos: [],
        owner: req.user?._id,
    });

    if (!playlist) {
        throw new apiError(
            500,
            "Something went wrong while creating the playlist"
        );
    }

    return res
        .status(201)
        .json(new apiResponse(201, playlist, "PLaylist created successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video id");
    }
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "playlist not found");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "video not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "you are not authorized to modify this playlist"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Video added in playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (
        !mongoose.isValidObjectId(videoId) ||
        !mongoose.isValidObjectId(playlistId)
    ) {
        throw new apiError(400, "Invalid video or playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "You are not authorized to remove video from this playlist"
        );
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Video removed from playlist successfully"
            )
        );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body || {};
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    if (!name?.trim() && !description?.trim()) {
        throw new apiError(
            400,
            "At least name or description is required to update"
        );
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "You are not authorized to update this playlist"
        );
    }

    const updateFields = {};
    if (name?.trim()) {
        updateFields.name = name.trim();
    }
    if (description?.trim()) {
        updateFields.description = description.trim();
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: updateFields,
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist Id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "you are not authorized to delete this playlist"
        );
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Playlist deleted successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "videoOwner",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        username: 1,
                                        fullname: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            videoOwner: {
                                $first: "$videoOwner",
                            },
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "playlistOwner",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            fullname: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                playlistOwner: {
                    $first: "$playlistOwner",
                },
                totalVideos: {
                    $size: "$videos",
                },
            },
        },
    ]);

    if (!playlist?.length) {
        throw new apiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, playlist[0], "Playlist fetched successfully")
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user id");
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new apiError(404, "User not found");
    }

    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "videoOwner",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        username: 1,
                                        fullname: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            videoOwner: {
                                $first: "$videoOwner",
                            },
                        },
                    },
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            views: 1,
                            videoOwner: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1,
                createdAt: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                userPlaylists,
                "User playlists fetched successfully"
            )
        );
});

export {
    createPlaylist,
    addVideoToPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
};
