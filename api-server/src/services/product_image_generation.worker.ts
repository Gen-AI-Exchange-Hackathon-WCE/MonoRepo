import { Worker } from "bullmq";
import { axiosInstance } from "../config/axios.config";
import { redisConnection } from "../config/redis.config";
import { logger } from "../utils/reqLogger";
import { dbClient } from "../config/prisma.config";

export const productImageWorker = new Worker(
  "product-image-generation",
  async (job) => {
    const { jobId, productMediaId, payload } = job.data;

    try {
      logger.info("Calling ML Service");
      const response = await axiosInstance.post(
        "/api/product-manage/generate-professional-shoot",
        payload
      );

      logger.info(`Background image generated for job ${jobId}`);
      logger.info(`Image URL: ${response.data.generated_product_image_url}`);

      const generatedUrl = response.data.generated_product_image_url;

      await dbClient.productImageGeneration.update({
        where: { id: jobId },
        data: {
          status: "completed",
          imageUrl: generatedUrl,
        },
      });

      await dbClient.productMedia.update({
        where: { id: productMediaId },
        data: {
          genereatedUrl: generatedUrl,
        },
      });
    } catch (err) {
      await dbClient.productImageGeneration.update({
        where: { id: jobId },
        data: { status: "failed" },
      });
      throw err;
    }
  },
  { connection: redisConnection }
);
