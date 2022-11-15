import express from "express";
import axios from "axios";
import { createToken } from "../service/authService.js";

const router = express.Router();

router.get("/notion/callback", async (req, res) => {
  const code = req.query.code;
  if (code !== null) {
    const response = await axios({
      method: "POST",
      url: "https://api.notion.com/v1/oauth/token",
      auth: {
        username: process.env.NOTION_CLIENT_ID,
        password: process.env.NOTION_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000/auth/notion/callback",
      },
    });
    console.log("ACCESS_TOKEN: ", response.data.access_token);
    console.log({ token: createToken(response.data.owner.user) });
    const token = createToken(response.data.owner.user);
    res.cookie("token", token, { httpOnly: true, maxAge: 3600 * 1000 });
    res.redirect("http://localhost:3000/create");
  }
});

export default router;
