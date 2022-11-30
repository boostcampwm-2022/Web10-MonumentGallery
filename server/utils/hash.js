import crypto from "crypto";

const { NOTION_CLIENT_SECRET } = process.env;

export default function hash(text) {
  if (!NOTION_CLIENT_SECRET || !text) {
    return null;
  }
  return crypto.createHmac("sha256", NOTION_CLIENT_SECRET).update(text).digest("hex");
}
