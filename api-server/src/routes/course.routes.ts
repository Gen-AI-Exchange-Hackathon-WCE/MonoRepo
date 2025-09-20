import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../utils/reqLogger";
import { validateRequest } from "../middlewares/reqValidate.middleware";

import {
  createCourse,
  searchCourses,
  uploadVideoToCourse,
} from "../controllers/courses.controller";
import {
  createCourseSchema,
  parseVideoFormData,
} from "../models/course.models";
import { upload } from "../middlewares/multer.middleware";
import { UploadVideoToCourseRequestSchema } from "../models/course.models";

const router = Router();

const uploadField = upload.single("courseVideo");

router.post(
  "/create-course",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/course/create-course Hit");
    next();
  },
  validateRequest(createCourseSchema),
  createCourse
);

router.post(
  "/upload-video",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/course/upload-video Hit");
    next();
  },
  uploadField,
  parseVideoFormData,
  validateRequest(UploadVideoToCourseRequestSchema),
  uploadVideoToCourse
);

router.get(
  "/search-courses",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/course/search-courses Hit");
    next();
  },
  searchCourses
);

export default router;
