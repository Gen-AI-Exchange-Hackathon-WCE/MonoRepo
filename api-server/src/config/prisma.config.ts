import { PrismaClient, Prisma } from "../../generated/prisma";
import { logger } from "../utils/reqLogger";

export const dbClient = new PrismaClient();

export const checkConnection = async () => {
  try {
    await dbClient.$queryRaw`SELECT 1`;
    logger.info("Connected to the main database");
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(
        {
          code: error.code,
          meta: error.meta,
          stack: error.stack,
        },
        `Database known request error occurred`
      );
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      logger.error(
        {
          message: error.message,
          stack: error.stack,
        },
        "Prisma initialization error"
      );
    } else {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        "Unknown database error"
      );
    }
    throw error;
  }
};
