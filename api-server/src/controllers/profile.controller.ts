import { Request, Response } from "express";
import { logger } from "../utils/reqLogger";
import { dbClient } from "../config/prisma.config";
import { ApiError, ApiResponse } from "../config/api.config";
import { uploadImageToCloudinary } from "../utils/cloudinary.utils";
import { ProfileDescriptionGenerationRequest } from "../types/types";
import { axiosInstance } from "../config/axios.config";
import { backgroundImageGenerationQueue } from "../services/background_image_generation.queue";
interface AuthenticatedRequest extends Request {
  userId: string;
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { artistId } = authReq.params;

    const profileInfo = await dbClient.artistProfile.findUnique({
      where: { artistId: Number(artistId) },
      include: {
        profession: true,
        descriptions: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!profileInfo) {
      const error = new ApiError(404, "Profile not found", [
        "No artist profile found with this ID",
      ]);
      res.status(error.statusCode).json(error);
      logger.warn(`Profile not found for artistId: ${artistId}`);
      return;
    }

    const response = new ApiResponse(
      200,
      profileInfo,
      "Profile fetched successfully"
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
    logger.error("Error fetching user profile:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    if (!req.file) {
      const error = new ApiError(400, "No file uploaded", [
        "Please attach an image file",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    const buffer = req.file.buffer;

    const timestamp = Date.now();

    const profilePhotoUrl = await uploadImageToCloudinary(buffer, {
      folder: "artist_profiles",
      public_id: `artist_${artistId}_profile_photo_${timestamp}`,
      overwrite: true,
    });

    if (!profilePhotoUrl) {
      const error = new ApiError(500, "Image upload failed", [
        "Failed to upload image to cloud storage",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    await dbClient.artistProfile.update({
      where: { artistId: Number(artistId) },
      data: { profilePhoto: profilePhotoUrl },
    });

    const response = new ApiResponse(
      200,
      { profilePhotoUrl },
      "Profile photo updated successfully"
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
    logger.error("Error updating profile photo:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const generateProfileDescription = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const { background_text, experience_text, custom_req_text } = req.body;

    const artistInfo = await dbClient.artistProfile.findUnique({
      where: { artistId: Number(artistId) },
      include: { profession: true, descriptions: true },
    });

    if (!artistInfo) {
      const error = new ApiError(404, "Artist not found", [
        "No artist profile found with this ID",
      ]);
      res.status(error.statusCode).json(error);
      logger.warn(`Artist not found for artistId: ${artistId}`);
      return;
    }

    const activeDescription = artistInfo.descriptions.find((d) => d.isActive);

    const previousDescriptions = artistInfo.descriptions
      .filter((d) => !d.isActive)
      .map((d) => d.descriptionText);

    const payload: ProfileDescriptionGenerationRequest = {
      profession: artistInfo.profession.name,
      location: activeDescription?.location ?? "",
      background: background_text ?? activeDescription?.backgroundInfo ?? "",
      experience: experience_text ?? activeDescription?.experience ?? "",
      custom_request: custom_req_text ?? null,
      previous_descriptions:
        previousDescriptions.length > 0 ? previousDescriptions : null,
    };

    const profileDescriptionGenerationResponse = await axiosInstance.post(
      "/api/profile-manage/generate-description",
      payload
    );

    logger.info(profileDescriptionGenerationResponse.data);

    const { description, plain_text } =
      profileDescriptionGenerationResponse.data;

    await dbClient.profileDescription.updateMany({
      where: {
        profileId: Number(artistId),
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const newDescription = await dbClient.profileDescription.create({
      data: {
        profileId: artistInfo.id,
        location: activeDescription?.location ?? "",
        backgroundInfo:
          background_text ?? activeDescription?.backgroundInfo ?? "",
        experience: experience_text ?? activeDescription?.experience ?? "",
        descriptionMarkdown: description,
        descriptionText: plain_text,
        isActive: true,
      },
    });

    const response = new ApiResponse(
      200,
      newDescription.descriptionMarkdown,
      "Profile description generated successfully"
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
    logger.error("Error generating profile description:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const generateProfileBackground = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = authReq.userId;

    const { background_text, experience_text, custom_req_text } = req.body;

    const artistInfo = await dbClient.artistProfile.findUnique({
      where: { artistId: Number(artistId) },
      include: { profession: true, descriptions: true },
    });

    if (!artistInfo) {
      const error = new ApiError(404, "Artist not found", [
        "No artist profile found with this ID",
      ]);
      res.status(error.statusCode).json(error);
      logger.warn(`Artist not found for artistId: ${artistId}`);
      return;
    }

    const activeDescription = artistInfo.descriptions.find((d) => d.isActive);

    const previousDescriptions = artistInfo.descriptions
      .filter((d) => !d.isActive)
      .map((d) => d.descriptionText);

    const payload: ProfileDescriptionGenerationRequest = {
      profession: artistInfo.profession.name,
      location: activeDescription?.location ?? "",
      background: background_text ?? activeDescription?.backgroundInfo ?? "",
      experience: experience_text ?? activeDescription?.experience ?? "",
      custom_request: custom_req_text ?? null,
      previous_descriptions:
        previousDescriptions.length > 0 ? previousDescriptions : null,
    };

    const jobRecord = await dbClient.backgroundImageGeneration.create({
      data: {
        artistId: Number(artistId),
        status: "PENDING",
      },
    });

    await backgroundImageGenerationQueue.add("generate-background", {
      jobId: jobRecord.id,
      artistId: Number(artistId),
      payload,
    });

    const response = new ApiResponse(
      202,
      { jobId: jobRecord.id },
      "Background image generation request queued successfully"
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
    logger.error("Error generating profile background:", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getProfileBackgroundGenerationStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      const error = new ApiError(400, "Job ID is required");
      res.status(error.statusCode).json(error);
      return;
    }

    const jobRecord = await dbClient.backgroundImageGeneration.findUnique({
      where: { id: Number(jobId) },
    });

    if (!jobRecord) {
      const error = new ApiError(404, "Job not found", [
        "No background image generation job found with this ID",
      ]);
      res.status(error.statusCode).json(error);
      logger.warn(`Job not found for jobId: ${jobId}`);
      return;
    }

    const response = new ApiResponse(
      200,
      {
        id: jobRecord.id,
        artistId: jobRecord.artistId,
        status: jobRecord.status,
        imageUrl: jobRecord.imageUrl ?? null,
        createdAt: jobRecord.createdAt,
        updatedAt: jobRecord.updatedAt,
      },
      "Background image generation job status fetched successfully"
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
    logger.error("Error fetching profile background generation status", error);
    res.status(err.statusCode).json(err);
    return;
  }
};
