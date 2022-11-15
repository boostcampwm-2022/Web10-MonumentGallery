import express from "express";
import path from "node:path";

const router = express.Router();

router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "../client/build/create.html"));
  console.log("this is main page!");
  res.sendFile(path.resolve("../client/dist/index.html"));
});
router.get("/create", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../client/build/create.html"));
  res.send("create 페이지 입니다.");
});

export default router;
