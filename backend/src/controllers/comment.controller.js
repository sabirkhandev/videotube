import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video Id");
    }

    if (!content || content.trim() === "") {
        throw new apiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: userId,
    });

    return res
        .status(201)
        .json(new apiResponse(201, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid comment Id");
    }

    if (!content || content.trim() === "") {
        throw new apiError(400, "Comment content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new apiError(404, "Comment does not exists");
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(403, "You are not authorized to edit this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
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
        .json(
            new apiResponse(200, updatedComment, "Comment updated successfully")
        );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new apiError(400, "Invalid comment Id");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new apiError(
            403,
            "you are not authorized to delete this comment"
        );
    }

    await Comment.findByIdAndDelete(commentId);

    await Like.deleteMany({ comment: commentId });

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Comment deleted successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortType = "desc",
    } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const commentAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "commentOwner",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            fullName: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                commentOwner: {
                    $first: "$commentOwner",
                },
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(req.user?._id),
                                "$likes.likedBy",
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
                createdAt: 1,
                commentOwner: 1,
                likesCount: 1,
                isLiked: 1,
            },
        },
    ]);

    const options = {
        page: page,
        limit: limit,
    };

    const allComments = await Comment.aggregatePaginate(
        commentAggregate,
        options
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                allComments,
                "All comments fetched successfully"
            )
        );
});

export { addComment, updateComment, deleteComment, getVideoComments };
