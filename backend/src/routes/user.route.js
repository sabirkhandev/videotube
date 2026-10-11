import Router from "express";
import {
    refreshAccessToken,
    registerUser,
    logoutUser,
    loginUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    deleteWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyJwtOptional } from "../middlewares/authOptional.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/current-user").get(verifyJwt, getCurrentUser);

router.route("/update-account").patch(verifyJwt, updateAccountDetails);

router.route("/change-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);

router
    .route("/change-coverImage")
    .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJwtOptional, getUserChannelProfile);

router.route("/history").get(verifyJwt, getWatchHistory);

router.route("/delete-history").patch(verifyJwt, deleteWatchHistory)

export default router;
