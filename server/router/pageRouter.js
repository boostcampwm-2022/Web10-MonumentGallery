import express from "express";

const router = express.Router();

router.get("/create", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../client/build/create.html"));
  res.send("create 페이지 입니다.");
});

export default router;
