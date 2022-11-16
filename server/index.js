import express from "express";
import proxy from "express-http-proxy";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRouter from "./router/authRouter.js";
import pageRouter from "./router/pageRouter.js";
import testRouter from "./router/testRouter.js";
import devRedirectRouter from "./router/devRedirectRouter.js";
import { HttpError } from "./utils/httpError.js";
import { HTTP_STATUS } from "./utils/constants.js";
import { startRedis } from "./model/accessTokenStore.js";

dotenv.config();

startRedis();
const app = express();
const port = 3000;

console.log(`[${process.env.NODE_ENV}]`);

const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.once("open", () => console.log("DB successfully connected"));
db.on("error", (err) => console.log("DB connection failed : ", err));

app.use("/assets", express.static("./dist/assets"));
app.use("/reset.css", express.static("./dist/reset.css"));
app.use("/vite.svg", express.static("./dist/vite.svg"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/test", testRouter);

if (process.env.NODE_ENV === "development") {
  console.log("dev!");
  app.use("/", devRedirectRouter);
  app.use(
    "/",
    proxy("http://localhost:5173", {
      skipToNextHandlerFilter: function (proxyRes) {
        return proxyRes.statusCode === HTTP_STATUS.NOT_FOUND;
      },
    })
  );
}
if (process.env.NODE_ENV === "production") {
  console.log("prod!");
  app.use("/", pageRouter);
}

// error handler
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).send({ reason: err.message });
  } else {
    console.error(err.stack);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      reason: "Server is bugged:( Plz report the bug to admin.",
    });
  }
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
