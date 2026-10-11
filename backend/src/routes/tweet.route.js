import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJwtOptional } from "../middlewares/authOptional.middleware.js";

const router = Router()

router.route("/create-tweet").post(verifyJwt, createTweet)
router.route("/update-tweet/:tweetId").patch(verifyJwt, updateTweet)
router.route("/delete-tweet/:tweetId").delete(verifyJwt, deleteTweet)
router.route("/user-tweets/:userId").get(verifyJwtOptional,getUserTweets)

export default router