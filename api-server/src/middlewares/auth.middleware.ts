import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { ApiError } from "../config/api.config";
import { dbClient } from "../config/prisma.config";
import { logger } from "../utils/reqLogger";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    logger.info(`Token from cookies: ${token}`);

    if (!token) {
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["No token provided"]));
      return;
    }

    const decoded = verifyToken(token) as {
      userId: string;
    };

    const { userId } = decoded;
    logger.info(`Decoded token payload: ${JSON.stringify(decoded)}`);

    if (!userId) {
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["Invalid token payload"]));
      return;
    }

    const user = await dbClient.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized", ["User not found"]));
    }

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    res.status(401).json(new ApiError(401, "Unauthorized", ["Invalid token"]));
  }
};
