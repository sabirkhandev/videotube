import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new apiError(400, "invalid channel id");
    }

    const subscribersList = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribersInfo",
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
                subscribersInfo: {
                    $first: "$subscribersInfo",
                },
            },
        },
        {
            $project: {
                _id: 1,
                subscribersInfo: 1,
            },
        },
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                subscribersList: subscribersList,
                subscribersCount: subscribersList.length,
            },
            "subscribers fetched successfully"
        )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new apiError(400, "Invalid subscriber ID");
    }

    const subscribedChannelsList = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannelInfo",
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
                subscribedChannelInfo: {
                    $first: "$subscribedChannelInfo",
                },
            },
        },
        {
            $project: {
                _id: 1,
                subscribedChannelInfo: 1,
            },
        },
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                subscribedChannelsList: subscribedChannelsList,
                subscribedChannelCount: subscribedChannelsList.length,
            },
            "Subscribed Channels info fetched successfully"
        )
    );
});

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid user ID");
    }

    if (channelId.toString() === userId.toString()) {
        throw new apiError(400, "you connot subscribe your own channel");
    }

    const existingSubcriber = await Subscription.findOne({
        channel: channelId,
        subscriber: userId,
    });

    if (existingSubcriber) {
        await Subscription.findOneAndDelete(existingSubcriber._id);

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    { isSubscribed: false },
                    "Unsubscribed successfully"
                )
            );
    }

    await Subscription.create({
        channel: channelId,
        subscriber: userId,
    });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { isSubscribed: true },
                "Subscribed successfully"
            )
        );
});

export { getUserChannelSubscribers, getSubscribedChannels, toggleSubscription };
