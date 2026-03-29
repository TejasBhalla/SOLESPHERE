import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.UPSTASH_REDIS_URL);
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

export default redis;