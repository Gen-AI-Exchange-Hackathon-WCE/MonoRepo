import { Request, Response } from "express";
import { logger } from "../utils/reqLogger";
import { ApiError, ApiResponse } from "../config/api.config";

export const getHealth = (req: Request, res: Response) => {
  logger.info("Health check endpoint called");
  const response = new ApiResponse(200, { status: "OK" }, "Service is healthy");
  res.status(response.statusCode).json(response);
};
