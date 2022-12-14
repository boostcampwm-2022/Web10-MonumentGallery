import express from "express";
import proxy from "express-http-proxy";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";

import { authMiddleware, catchAuthError } from "./middlewares/authMiddleware.js";
import authRouter from "./router/authRouter.js";
import redirectRouter from "./router/redirectRouter.js";
import pageRouter from "./router/pageRouter.js";
import testRouter from "./router/testRouter.js";
import galleryRouter from "./router/galleryRouter.js";
import { HttpError } from "./utils/httpError.js";
import { HTTP_STATUS } from "./utils/constants.js";
import { startRedis } from "./model/accessTokenStore.js";
import ipaddrMiddleware from "./middlewares/ipaddrMiddleware.js";

dotenv.config();
const app = express();
const port = 3000;

// redis connection
startRedis();

// mongoDB connection
const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.once("open", () => console.log("DB successfully connected"));
db.on("error", (err) => console.log("DB connection failed : ", err));

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(ipaddrMiddleware);

// api routing
app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/api", galleryRouter);
app.use("/", redirectRouter);

// page routing
if (process.env.NODE_ENV === "development") {
  console.log("dev!");
  app.use(
    "/",
    proxy("http://localhost:5173", {
      skipToNextHandlerFilter: function (proxyRes) {
        return proxyRes.statusCode === HTTP_STATUS.NOT_FOUND;
      },
    }),
  );
}
if (process.env.NODE_ENV === "production") {
  console.log("prod!");
  app.use("/", pageRouter);
  app.use("/", express.static("./dist/", { index: false }));
}

// error handler
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    console.log(err.message);
    res.status(err.statusCode).json({ reason: err.message });
  } else {
    console.log(err.stack);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      reason: "Server is bugged:( Plz report the bug to admin.",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
