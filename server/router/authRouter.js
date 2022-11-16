import express from "express";
import { getTokenDataFromNotion, saveToken } from "../service/authService.js";
import { asyncHandler } from "../utils/utils.js";

const router = express.Router();

router.get("/notion/callback", asyncHandler(async (req, res) => {
  const code = req.query.code;
  console.log(req.query);
  if (code !== null) {
    const tokenData = await getTokenDataFromNotion(code);
    const jwtToken = saveToken(tokenData);
    console.log(jwtToken);
    res.cookie("token", jwtToken, { httpOnly: true, maxAge: 3600 * 1000 });
    res.redirect("/create");
    return;
  }
  res.status(401).send({result:"failed", reason:"Notion OAuth 인증에 실패했습니다!"});
}));

export default router;
