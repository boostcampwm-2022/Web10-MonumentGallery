import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/create", authMiddleware, (req, res, next) => {
  console.log(req.userid);
  if (req.userid == null) return res.redirect("/");
  next();
});

export default router;
