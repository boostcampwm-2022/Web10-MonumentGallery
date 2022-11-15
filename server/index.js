import express from "express";
import proxy from "express-http-proxy";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./router/authRouter.js";
import pageRouter from "./router/pageRouter.js";
import testRouter from "./router/testRouter.js";
import devRedirectRouter from"./router/devRedirectRouter.js";

dotenv.config();
const app = express();
const port = 3000;

console.log(`[${process.env.NODE_ENV}]`);

const mongoURI = process.env.MONGO_URL;
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.once("open", () => console.log("DB successfully connected"));
db.on("error", (err) => console.log("DB connection failed : ", err));

app.use("/assets", express.static("../client/dist/assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/test", testRouter);

if(process.env.NODE_ENV === "development") {
  console.log("dev!");
  app.use("/", devRedirectRouter);
  app.use("/", proxy(
    "http://localhost:5173",
    {
      skipToNextHandlerFilter: function(proxyRes) {
        return proxyRes.statusCode === 404;
      }
    },
  ));
}
if(process.env.NODE_ENV === "production") {
  console.log("prod!");
  app.use("/", pageRouter);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});