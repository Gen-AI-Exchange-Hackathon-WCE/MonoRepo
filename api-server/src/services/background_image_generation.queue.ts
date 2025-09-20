import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config";

export const backgroundImageGenerationQueue = new Queue(
  "background-image-generation",
  {
    connection: redisConnection,
  }
);
