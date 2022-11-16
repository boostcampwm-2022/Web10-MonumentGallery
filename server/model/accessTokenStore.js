import dotenv from "dotenv";
import { createClient } from "redis";
import { TOKEN_EXPIRES } from "../utils/constants.js";

dotenv.config();

const client = createClient({ url: process.env.REDIS_URL });
let connectStatus = false;
client.on("error", (err) => console.log("redis err", err));
client.on("connect", () => console.log("redis connected"));
client.on("reconnecting", () => console.log("redis reconnecting"));
client.on("ready", () => {
  connectStatus = true;
  console.log("redis ready");
});

export function startRedis() {
  client.connect();
}

export function getRedisClient() {
  return new Promise( (resolve, reject)=>{
    if(connectStatus === true) return resolve(client);
    const timeoutEvent = setTimeout(()=>{
      reject(new Error("timeout error!"));
    }, 100000);
    client.once("ready", ()=>{
      clearTimeout(timeoutEvent);
      resolve(client);
    });
  });
}

export async function saveTokenData(token, data) {
  const client = await getRedisClient();
  const options = { EX: TOKEN_EXPIRES };
  console.log(options);
  await client.set(token, JSON.stringify(data), options);
}

export async function loadDataFromToken(token) {
  const client = await getRedisClient();
  const isExists = await client.exists(token);
  console.log({isExists, token});
  if (!isExists) return null;
  const data = await client.get(token);
  return JSON.parse(data);
}
