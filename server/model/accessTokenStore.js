import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });

export async function startRedis() {
  client.on("error", (err) => console.log("redis err", err));
  client.on("connect", () => console.log("redis connected"));
  client.on("reconnecting", () => console.log("redis reconnecting"));
  client.on("ready", () => console.log("redis ready"));
  await client.connect();
}

export async function saveTokenData(token, data) {
  await client.set(token, JSON.stringify(data));
}

export async function loadDataFromToken(token) {
  const isExists = client.exists(token);
  if (!isExists) return null;
  const data = await client.get(token);
  return JSON.parse(data);
}
