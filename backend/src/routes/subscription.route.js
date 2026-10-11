import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJwtOptional } from "../middlewares/authOptional.middleware.js";


const router = Router()

router.route("/subscribers/:channelId").get(verifyJwt, getUserChannelSubscribers)
router.route("/subscribed-channels/:subscriberId").get(verifyJwt, getSubscribedChannels)
router.route("/toggle-subscriptions/:channelId").patch(verifyJwt, toggleSubscription)

export default router