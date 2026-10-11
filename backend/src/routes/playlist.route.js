import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJwtOptional } from "../middlewares/authOptional.middleware.js";

const router = Router()

router.route("/create-playlist").post(verifyJwt, createPlaylist)
router.route("/add/v/playlist/:videoId/:playlistId").patch(verifyJwt, addVideoToPlaylist)
router.route("/update-playlist/:playlistId").patch(verifyJwt, updatePlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJwt, deletePlaylist)
router.route("/playlist/:playlistId").get(verifyJwtOptional, getPlaylistById)
router.route("/user-playlist/:userId").get(verifyJwtOptional, getUserPlaylists)
router.route("/remove/v/playlist/:videoId/:playlistId").patch(verifyJwt, removeVideoFromPlaylist)

export default router