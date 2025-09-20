import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  }),
});

export const parseVideoFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = (req.body.tags as string).split(",").map((c) => c.trim());
    }

    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      errors: ["Invalid JSON in form fields"],
    });
  }
};

export const UploadVideoToCourseRequestSchema = z.object({
  body: z.object({
    courseId: z.string("Course ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
