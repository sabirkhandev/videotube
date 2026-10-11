import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getAllLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/all-liked-videos").get(verifyJwt, getAllLikedVideos)

router.route("/toggle/v/like/:videoId").patch(verifyJwt, toggleVideoLike)
router.route("/toggle/c/like/:commentId").patch(verifyJwt, toggleCommentLike)
router.route("/toggle/t/like/:tweetId").patch(verifyJwt, toggleTweetLike)

export default router;
