import Redis from "ioredis";
import envConfig from "./env.config";

export const redisConnection = new Redis({
  host: envConfig.REDIS_ENDPOINT,
  port: Number(envConfig.REDIS_PORT),
  maxRetriesPerRequest: null,
});
