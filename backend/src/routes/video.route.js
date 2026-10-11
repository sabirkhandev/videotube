import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifyJwtOptional } from "../middlewares/authOptional.middleware.js";
import { deleteVideo, getVideoById, updateVideoDetail, uploadVideo, togglePublishStatus, getAllVideos } from "../controllers/video.controller.js";

const router = Router();

router.route("/upload-video").post( verifyJwt, upload.fields([
    {
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]) , uploadVideo);

router.route("/update-video-detail/:videoId").patch(verifyJwt, upload.single("thumbnail"), updateVideoDetail)

router.route("/get-video/:videoId").get(verifyJwtOptional, getVideoById)

router.route("/delete-video/:videoId").delete(verifyJwt, deleteVideo)

router.route("/publish-status/:videoId").patch(verifyJwt, togglePublishStatus)

router.route("/all-videos").get(verifyJwtOptional, getAllVideos)

export default router;
