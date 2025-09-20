import { Request, Response } from "express";
import { dbClient } from "../config/prisma.config";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.utils";
import envConfig from "../config/env.config";
import { logger } from "../utils/reqLogger";
import { ApiError, ApiResponse } from "../config/api.config";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await dbClient.user.findFirst({
      where: name ? { name } : { email },
    });
    if (!user) {
      const error = new ApiError(401, "Invalid credentials", [
        "User not found",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    if (envConfig.NODE_ENV === "production") {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const error = new ApiError(401, "Invalid credentials");
        res.status(error.statusCode).json(error);
        return;
      }
    }

    const token = signToken({
      userId: user.id,
    });

    logger.info(`Generated JWT Token: ${token}`);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: envConfig.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(
      `User ${user.name} logged in successfully with Role ${user.role}`
    );

    const response = new ApiResponse(
      200,
      {
        userId: user.id,
        username: user.name,
        role: user.role,
      },
      "Login successful"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(500, error.message, [], error.stack);
    res.status(err.statusCode).json(err);
    logger.error("Error during login", error);
    return;
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role, professionCode, businessLocation } =
      req.body;

    const ifUserExists = await dbClient.user.findFirst({
      where: name ? { name } : { email },
    });

    if (ifUserExists) {
      const error = new ApiError(409, "User already exists", [
        "A user with the provided name or email already exists",
      ]);
      res.status(error.statusCode).json(error);
      logger.warn(
        `Attempt to register with existing credentials: ${name || email}`
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await dbClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "ARTIST") {
      const newArtist = await dbClient.artist.create({
        data: {
          artistId: newUser.id,
        },
      });

      const newArtistProfile = await dbClient.artistProfile.create({
        data: {
          artistId: newArtist.artistId,
          professionCode: professionCode,
          backgroundPoster: "",
          backgroundVideos: [],
          badgeIds: [],
          businessLocation: businessLocation,
        },
      });

      if (!newArtistProfile) {
        const err = new ApiError(
          500,
          "Failed to create artist",
          [],
          "Artist creation returned null"
        );
        logger.error("Error creating investor");
        res.status(err.statusCode).json(err);
        return;
      }
    } else if (role === "INVESTOR") {
      const newInvestor = await dbClient.investor.create({
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phoneNumber ?? null,
        },
      });

      if (!newInvestor) {
        const err = new ApiError(
          500,
          "Failed to create investor",
          [],
          "Investor creation returned null"
        );
        logger.error("Error creating investor");
        res.status(err.statusCode).json(err);
        return;
      }
    }

    logger.info(
      `User ${newUser.name} registered successfully with Role ${newUser.role}`
    );

    const response = new ApiResponse(
      201,
      {
        userId: newUser.id,
        username: newUser.name,
        role: newUser.role,
      },
      "User registered successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error: any) {
    const err = new ApiError(500, error.message, [], error.stack);
    res.status(err.statusCode).json(err);
    logger.error("Error during register", error);
    return;
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  logger.info("User logged out successfully");

  const response = new ApiResponse(200, {}, "Logout successful");
  res.status(response.statusCode).json(response);
  return;
};

export const verifySession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId;

    if (!userId) {
      const error = new ApiError(401, "Unauthorized", [
        "User ID not found in request",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    const user = await dbClient.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, name: true, role: true },
    });

    if (!user) {
      const error = new ApiError(404, "User not found");
      res.status(error.statusCode).json(error);
      return;
    }

    logger.info(
      `Session verified successfully for ${user.name} and role ${user.role}`
    );

    const response = new ApiResponse(200, user, "Session is valid");
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(500, error.message, [], error.stack);
    logger.error("Error Verifying Session", error);
    res.status(err.statusCode).json(err);
    return;
  }
};
