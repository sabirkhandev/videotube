import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "https://videotube-seven-gamma.vercel.app",
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        limit: "16kb",
        extended: true,
    })
);

app.use(express.static("public"));

app.use(cookieParser());

//route import
//url look like this http://localhost:8000/api/v1/users/register
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import likeRouter from "./routes/like.route.js"
import commentRouter from "./routes/comment.route.js"
import tweetRouter from "./routes/tweet.route.js"
import playlistRouter from "./routes/playlist.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"

app.use("/api/v1/users/", userRouter);
app.use("/api/v1/videos/", videoRouter);
app.use("/api/v1/subscriptions/", subscriptionRouter);
app.use("/api/v1/likes/", likeRouter);
app.use("/api/v1/comments/", commentRouter);
app.use("/api/v1/tweets/", tweetRouter);
app.use("/api/v1/playlists/", playlistRouter);
app.use("/api/v1/healthchecks", healthcheckRouter)

import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
app.use(errorHandler)
app.use("/{*splat}", notFound)

export default app;
