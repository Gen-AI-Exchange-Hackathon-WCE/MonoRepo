import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config";

export const productImageGenerationQueue = new Queue(
  "product-image-generation",
  {
    connection: redisConnection,
  }
);
