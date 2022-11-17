import express from "express";
import path from "node:path";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});
router.get("/create", async (req, res) => {
  res.sendFile(path.resolve("./dist/create.html"));
});
router.get("/myspace", async (req, res) => {
  res.sendFile(path.resolve("./dist/myspace.html"));
});

export default router;
