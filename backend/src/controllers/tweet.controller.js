import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user?._id;

    if (!content || content.trim() === "") {
        throw new apiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: userId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, tweet, "Tweet created successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet Id");
    }

    if (!content || content.trim() === "") {
        throw new apiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet does not exists");
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to edit this tweet");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content.trim(),
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(new apiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new apiError(400, "Invalid tweet Id");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new apiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(403, "you are not authorized to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    await Like.deleteMany({ tweet: tweetId });

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    let {
        page = 1,
        limit = 15,
        sortBy = "createdAt",
        sortType = "desc",
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!mongoose.isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user Id");
    }

    const tweetAggregate = Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "tweetOwner",
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
                tweetOwner: {
                    $first: "$tweetOwner",
                },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "allLikes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$allLikes",
                },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [
                                req.user?._id
                                    ? new mongoose.Types.ObjectId(req.user?._id)
                                    : null,
                                "$allLikes.likedBy",
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                tweetOwner: 1,
                likesCount: 1,
                isLiked: 1,
                createdAt: 1,
            },
        },
    ]);

    const options = {
        page: page,
        limit: limit,
    };

    const allTweets = await Tweet.aggregatePaginate(tweetAggregate, options);

    return res
        .status(200)
        .json(
            new apiResponse(200, allTweets, "All tweets fetched successfully")
        );
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
