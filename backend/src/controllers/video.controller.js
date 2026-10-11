import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if ([title, description].some((field) => field?.trim() === "")) {
        if (req.files?.videoFile?.[0]?.path) {
            fs.unlinkSync(req.files.videoFile[0].path);
        }
        if (req.files?.thumbnail?.[0]?.path) {
            fs.unlinkSync(req.files.thumbnail[0].path);
        }
        throw new apiError(400, "Title and Description are required");
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        if (thumbnailLocalPath) {
            fs.unlinkSync(thumbnailLocalPath);
        }
        throw new apiError(400, "video file is required");
    }
    if (!thumbnailLocalPath) {
        if (videoFileLocalPath) {
            fs.unlinkSync(videoFileLocalPath);
        }
        throw new apiError(400, "thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new apiError(
            500,
            "somthing went wrong while uploading the video file"
        );
    }

    const videoFileDuration = videoFile?.duration || 0;

    if (!thumbnail) {
        throw new apiError(
            500,
            "somthing went wrong while uploading the thumbnail"
        );
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        videoFilePublicId: videoFile.public_id,
        thumbnail: thumbnail.url,
        thumbnailPublicId: thumbnail.public_id,
        owner: req.user?._id,
        isPublished: true,
        duration: videoFileDuration,
    });

    return res
        .status(201)
        .json(new apiResponse(201, video, "video uploaded successfully"));
});

const updateVideoDetail = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title && !description && !req.file) {
        throw new apiError(
            400,
            "At least one field (title, description, or thumbnail) is required"
        );
    }

    const updateFields = {};

    if (title && title.trim() !== "") {
        updateFields.title = title;
    }

    if (description && description.trim() !== "") {
        updateFields.description = description;
    }

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail?.url) {
            throw new apiError(
                500,
                "Something went wrong while uploading on cloudinary"
            );
        }

        updateFields.thumbnail = thumbnail.url;
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields,
        },
        {
            new: true,
        }
    );

    if (!video) {
        throw new apiError(404, "Video not found!");
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, video, "video details updated successfully")
        );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    if (req.user?._id) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { watchHistory: videoId }, 
            },
            { new: true }
        );
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "videoOwner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "allLikes",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $addFields: {
                videoOwner: { $first: "$videoOwner" },
                likesCount: { $size: "$allLikes" },
                subscribersCount: { $size: "$subscribers" },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [
                                req.user?._id
                                    ? new mongoose.Types.ObjectId(req.user._id)
                                    : null,
                                "$allLikes.likedBy",
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [
                                req.user?._id
                                    ? new mongoose.Types.ObjectId(req.user._id)
                                    : null,
                                "$subscribers.subscriber",
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                thumbnail: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                videoOwner: 1,
                likesCount: 1,
                subscribersCount: 1,
                isLiked: 1,
                isSubscribed: 1,
            },
        },
    ]);

    if (!video?.length) {
        throw new apiError(404, "video not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, video[0], "video fetched successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "you don't have permission to delete this video"
        );
    }

    const videoFilePublicId = video.videoFilePublicId;
    const thumbnailPublicId = video.thumbnailPublicId;

    if (videoFilePublicId) {
        await deleteFromCloudinary(videoFilePublicId, "video");
    }

    if (thumbnailPublicId) {
        await deleteFromCloudinary(thumbnailPublicId, "image");
    }

    await Video.findByIdAndDelete(videoId);

    await Like.deleteMany({ video: videoId });

    await Comment.deleteMany({ video: videoId });

    await Playlist.updateMany(
        { videos: videoId },
        {
            $pull: {
                videos: videoId,
            },
        }
    );

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "video not found!");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "you are not authorized to perform this operation"
        );
    }

    video.isPublished = !video.isPublished;

    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { isPublished: video.isPublished },
                "video publish status is toggle successfully"
            )
        );
});

const getAllVideos = asyncHandler(async (req, res) => {
    let {
        query,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const matchCondition = {
        isPublished: true,
    };

    if (query && query.trim() !== "") {
        matchCondition.$or = [
            { title: { $regex: query.trim(), $options: "i" } },
            { description: { $regex: query.trim(), $options: "i" } },
        ];
    }
    if (userId) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new apiError(400, "invalid user id");
        }
        matchCondition.owner = new mongoose.Types.ObjectId(userId);
    }

    const videoAggregate = Video.aggregate([
        {
            $match: matchCondition,
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "videoOwner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                videoOwner: { $first: "$videoOwner" },
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
    ]);

    const options = {
        page: page,
        limit: limit,
    };

    let allVideos;
    try {
        allVideos = await Video.aggregatePaginate(videoAggregate, options);
    } catch (error) {
        throw new apiError(
            500,
            error?.message || "Error while paginating videos"
        );
    }
    return res
        .status(200)
        .json(
            new apiResponse(200, allVideos, "All videos fetched successfully")
        );
});

export {
    uploadVideo,
    updateVideoDetail,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
    getAllVideos,
};
