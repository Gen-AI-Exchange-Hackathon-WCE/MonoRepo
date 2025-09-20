import app from "./app";
import { logger } from "./utils/reqLogger";
import { checkConnection } from "./config/prisma.config";
import "./services/background_image_generation.worker";
import "./services/product_image_generation.worker";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await checkConnection();
    logger.info("Database connection successful.");

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    logger.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
