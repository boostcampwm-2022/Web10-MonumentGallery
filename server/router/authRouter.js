import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTokenDataFromNotion, saveToken } from "../service/authService.js";
import { asyncHandler } from "../utils/utils.js";
import { TOKEN_EXPIRES } from "../utils/constants.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.redirect(process.env.NOTION_LOGIN_URL);
});

router.get(
  "/notion/callback",
  asyncHandler(async (req, res) => {
    const code = req.query.code;
    if (code === undefined) {
      // return res.status(401).send({ result: "failed", reason: "Notion OAuth 인증에 실패했습니다!" });
      res.redirect("/");
    }
    const tokenData = await getTokenDataFromNotion(code);
    const jwtToken = saveToken(tokenData);
    res.cookie("token", jwtToken, { httpOnly: true, maxAge: TOKEN_EXPIRES * 1000 });
    res.redirect("/create");
  }),
);

router.get("/check", authMiddleware, (req, res) => {
  const id = req.userid ?? null;
  const name = req.username ?? null;
  const avatarUrl = req.avatar_url ?? null;
  res.json({ logined: !!id, user: { id, name, avatarUrl } });
});

export default router;
