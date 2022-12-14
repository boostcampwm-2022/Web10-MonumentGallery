import axios from "axios";
import jwt from "jsonwebtoken";
import { saveTokenData, hasTokenData, loadDataFromToken } from "../model/accessTokenStore.js";
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
      redirect_uri: process.env.NOTION_REDIRECT_URL,
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

export async function validateToken(jwtToken) {
  if (jwtToken == null) return { success: false, reason: "미로그인 상태" };

  try {
    const tokenRawData = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
    await hasTokenData(jwtToken);
    return { success: true, data: tokenRawData };
  } catch (e) {
    return { success: false, reason: e.message };
  }
}

export function extractUserDataFromToken(jwtToken) {
  return loadDataFromToken(jwtToken);
}
