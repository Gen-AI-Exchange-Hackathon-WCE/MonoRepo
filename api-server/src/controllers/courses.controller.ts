import { Request, Response } from "express";
import { dbClient } from "../config/prisma.config";
import { logger } from "../utils/reqLogger";
import { ApiError, ApiResponse } from "../config/api.config";
import { uploadVideoToCloudinary } from "../utils/cloudinary.utils";
import {
  CreateCourseRequest,
  UploadVideoToCourseRequest,
} from "../types/types";
import { SearchVideoOrCourseRequest } from "../types/types";
import { axiosInstance } from "../config/axios.config";
import { CloudinaryUploadOptions } from "../utils/cloudinary.utils";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const createCourse = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = Number(authReq.userId);
    const body = req.body as CreateCourseRequest;
    const { title, description } = body;

    const artist = await dbClient.user.findFirst({
      where: { id: Number(artistId), role: "ARTIST" as any },
    });

    if (!artist) {
      return res.status(404).json(new ApiError(404, "Artist not found"));
    }

    // 3. Create course in DB
    const newCourse = await dbClient.course.create({
      data: {
        artistId: Number(artistId),
        title,
        description,
      },
    });

    // 4. Respond with success
    const response = new ApiResponse(
      201,
      newCourse,
      "Course created successfully"
    );
    return res.status(response.statusCode).json(response);
  } catch (err: any) {
    const error = new ApiError(
      500,
      err.message || "Internal Server Error",
      [],
      err.stack
    );
    logger.error("Error creating course", err);
    return res.status(error.statusCode).json(error);
  }
};

export const uploadVideoToCourse = async (req: Request, res: Response) => {
  try {
    const body = req.body as UploadVideoToCourseRequest;
    const { courseId, title, description, tags } = body;

    const course = await dbClient.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return res.status(404).json(new ApiError(404, "Course not found"));
    }

    if (!req.file) {
      const error = new ApiError(400, "No file uploaded", [
        "Please attach a video",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    const buffer = req.file.buffer;

    const timestamp = Date.now();

    const courseVideoUrl = await uploadVideoToCloudinary(buffer, {
      folder: "course_videos",
      public_id: `course_${courseId}_video_${timestamp}`,
      overwrite: true,
    });

    if (!courseVideoUrl) {
      const error = new ApiError(500, "Video upload failed", [
        "Failed to upload video to cloud storage",
      ]);
      res.status(error.statusCode).json(error);
      return;
    }

    const listedVideo = await dbClient.video.create({
      data: {
        title: title,
        description: description,
        url: courseVideoUrl,
        tags: tags,
        course: {
          connect: { id: Number(courseId) },
        },
      },
    });

    const response = new ApiResponse(
      201,
      listedVideo,
      "Video added Successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (err: any) {
    const error = new ApiError(
      500,
      err.message || "Internal Server Error",
      [],
      err.stack
    );
    logger.error("Error uploading video to course", err);
    return res.status(error.statusCode).json(error);
  }
};

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { courseTitle, videoTitle, artistName, tags } = req.query as {
      courseTitle?: string;
      videoTitle?: string;
      artistName?: string;
      tags?: string | string[];
    };

    const parsedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    const whereClause: any = {
      AND: [],
    };

    if (courseTitle) {
      whereClause.AND.push({
        title: { contains: courseTitle, mode: "insensitive" },
      });
    }

    if (videoTitle) {
      whereClause.AND.push({
        videos: {
          some: { title: { contains: videoTitle, mode: "insensitive" } },
        },
      });
    }

    if (artistName) {
      whereClause.AND.push({
        artist: {
          user: { name: { contains: artistName, mode: "insensitive" } },
        },
      });
    }

    if (parsedTags.length > 0) {
      whereClause.AND.push({
        videos: { some: { tags: { hasSome: parsedTags } } },
      });
    }

    // If no filters applied, return all courses
    const courses = await dbClient.course.findMany({
      where: whereClause.AND.length > 0 ? whereClause : undefined,
      include: {
        artist: { include: { user: true } },
        videos: true,
      },
    });

    res.status(200).json(new ApiResponse(200, courses, "Search results"));
    return;
  } catch (error: any) {
    logger.error("Error searching courses/videos", error);
    res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
    return;
  }
};
