import { Request, Response } from "express";
import { logger } from "../utils/reqLogger";
import { ApiResponse, ApiError } from "../config/api.config";
import { dbClient } from "../config/prisma.config";
import bcrypt from "bcryptjs";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, address } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId;

    const updatedUser = await dbClient.user.update({
      where: { id: Number(userId) },
      data: { phoneNumber, address },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    const response = new ApiResponse(
      200,
      userWithoutPassword,
      "User info updated successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error updating user info:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await dbClient.user.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    });

    const response = new ApiResponse(
      200,
      null,
      "Password updated successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Server Error",
      [],
      error.stack
    );
    logger.error("Error updating user password:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};
