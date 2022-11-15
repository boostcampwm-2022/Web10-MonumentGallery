import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//   legacyMode: true,
// });

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Redis connected!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
// redisClient.connect().then(); // redis v4 연결 (비동기)

// const redisCli = redisClient.v4;
const redisCli = redisClient;

export async function saveTokenData(token, data) {
  await redisCli.set(token, JSON.stringify(data));
}

export async function loadDataFromToken(token) {
  const isExists = redisCli.exists(token);
  if (!isExists) return null;
  const data = await redisCli.get(token);
  return JSON.parse(data);
}
