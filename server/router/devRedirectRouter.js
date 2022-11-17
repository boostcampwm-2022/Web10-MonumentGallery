import express from "express";

const router = express.Router();

router.get("/create", (req, res) => {
  if (req.userid == null) return res.redirect("/");
  res.redirect("/create.html");
});
router.get("/myspace", (req, res) => {
  res.redirect("/myspace.html");
});

export default router;
