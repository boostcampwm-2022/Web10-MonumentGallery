import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisCli = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

export async function saveTokenData(token, data) {
  await redisCli.set(token, JSON.stringify(data));
}

export async function loadDataFromToken(token) {
  const isExists = redisCli.exists(token);
  if (!isExists) return null;
  const data = await redisCli.get(token);
  return JSON.parse(data);
}
