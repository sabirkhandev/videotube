import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAllLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const likedVideosList = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true, $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideosDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullname: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            ownerDetails: {
                                $first: "$ownerDetails",
                            },
                        },
                    },
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1,
                            ownerDetails: 1,
                        },
                    },
                ],
            },
        },

        {
            $addFields: {
                likedVideosDetails: {
                    $first: "$likedVideosDetails",
                },
            },
        },
        {
            $project: {
                _id: 1,
                likedVideosDetails: 1,
                createdAt: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    likedVideos: likedVideosList,
                    likedVideosCount: likedVideosList.length,
                },
                " All liked videos fetched successfully"
            )
        );
});

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video Id");
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new apiError(404, "video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    { isLiked: false },
                    "video like removed successfully"
                )
            );
    }

    await Like.create({
        video: videoId,
        likedBy: userId,
    });

    return res
        .status(200)
        .json(
            new apiResponse(200, { isLike: true }, "video liked successfully")
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid comment ID");
    }

    const commentExists = await Comment.findById(commentId);
    if (!commentExists) {
        throw new apiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new apiResponse(200, { isLiked: false }, "Comment like removed")
            );
    }

    await Like.create({
        comment: commentId,
        likedBy: userId,
    });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { isLiked: true },
                "Comment liked successfully"
            )
        );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet ID");
    }

    const tweetExists = await Tweet.findById(tweetId);
    if (!tweetExists) {
        throw new apiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new apiResponse(200, { isLiked: false }, "Tweet like removed")
            );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId,
    });

    return res
        .status(200)
        .json(
            new apiResponse(200, { isLiked: true }, "Tweet liked successfully")
        );
});

export {
    getAllLikedVideos,
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
};
