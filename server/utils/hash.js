import crypto from "crypto";

const { NOTION_CLIENT_SECRET } = process.env;

export default function hash(text) {
  return crypto.createHmac("sha256", NOTION_CLIENT_SECRET).update(text).digest("hex");
}
