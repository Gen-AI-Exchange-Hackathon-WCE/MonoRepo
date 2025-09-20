import { Worker } from "bullmq";
import { axiosInstance } from "../config/axios.config";
import { redisConnection } from "../config/redis.config";
import { logger } from "../utils/reqLogger";
import { dbClient } from "../config/prisma.config";

export const backgroundImageWorker = new Worker(
  "background-image-generation",
  async (job) => {
    const { jobId, artistId, payload } = job.data;

    try {
      logger.info("Calling ML Service");
      const response = await axiosInstance.post(
        "/api/profile-manage/get-profile-background",
        payload
      );

      logger.info(`Background image generated for job ${jobId}`);
      logger.info(`Image URL: ${response.data.background_url}`);

      const backgroundPoster = response.data.background_url;

      await dbClient.backgroundImageGeneration.update({
        where: { id: jobId },
        data: {
          status: "completed",
          imageUrl: backgroundPoster,
        },
      });

      await dbClient.artistProfile.update({
        where: { artistId: artistId },
        data: {
          backgroundPoster: backgroundPoster,
        },
      });
    } catch (err) {
      await dbClient.backgroundImageGeneration.update({
        where: { id: jobId },
        data: { status: "failed" },
      });
      throw err;
    }
  },
  { connection: redisConnection }
);
