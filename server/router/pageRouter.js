import express from "express";
import path from "node:path";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("this is main page!");
  res.sendFile(path.resolve("../client/dist/index.html"));
});
router.get("/create", async (req, res) => {
  if( req.userid == null ) return res.redirect("/");
  res.sendFile(path.resolve("../client/dist/create.html"));
});

export default router;
