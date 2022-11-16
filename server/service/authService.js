import axios from "axios";
import jwt from "jsonwebtoken";
import { saveTokenData } from "../model/accessTokenStore.js";
import { UnauthenticatedError } from "../utils/httpError.js";

export async function getTokenDataFromNotion(code) {
  if (code == null) {
    throw new UnauthenticatedError("코드를 못 받아옴");
  }
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
      code,
      redirect_uri: "http://localhost:3000/auth/notion/callback",
    },
  });
  const { user } = response.data.owner;
  const accessToken = response.data.access_token;

  return { user, accessToken };
}

export function createToken(user) {
  const expiresIn = "1h";
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn });
}

export function saveToken({ user, accessToken }) {
  const jwtToken = createToken(user);
  saveTokenData(jwtToken, { user, accessToken });
  return jwtToken;
}
