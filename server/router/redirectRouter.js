import express from "express";
import path from "node:path";

const router = express.Router();

router.get("/create", (req, res, next) => {
  if (req.userid == null) return res.redirect("/");
  next();
});

export default router;
