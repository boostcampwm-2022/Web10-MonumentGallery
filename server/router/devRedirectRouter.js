import express from "express";

const router = express.Router();

router.get("/create", (req, res) => {
  res.redirect("/create.html");
});

export default router;
