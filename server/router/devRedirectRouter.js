import express from "express";

const router = express.Router();

router.get("/create", (req, res) => {
  if( req.userid == null ) return res.redirect("/");
  res.redirect("/create.html");
});

export default router;
