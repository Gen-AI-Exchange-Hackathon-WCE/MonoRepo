import { Router, NextFunction, Request, Response } from "express";
import { logger } from "../utils/reqLogger";
import {
  generateProfileBackground,
  generateProfileDescription,
  getProfile,
  getProfileBackgroundGenerationStatus,
  updateProfilePhoto,
} from "../controllers/profile.controller";
import { validateRequest } from "../middlewares/reqValidate.middleware";
import {
  generateProfileDescriptionSchema,
  generateProfileBackgroundSchema,
  getProfileInfoSchema,
  getProfileBackgroundGenerationStatusSchema,
} from "../models/profile.models";
import { upload } from "../middlewares/multer.middleware";

const uploadField = upload.single("profilePhoto");

const router = Router();

router.get(
  "/:artistId",
  validateRequest(getProfileInfoSchema),
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/profile/:artistId Hit");
    next();
  },
  getProfile
);

router.put(
  "/photo",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PUT /api/profile/photo Hit");
    next();
  },
  uploadField,
  updateProfilePhoto
);

router.post(
  "/generate-description",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/profile/generate-description Hit");
    next();
  },
  validateRequest(generateProfileDescriptionSchema),
  generateProfileDescription
);

router.post(
  "/generate-background",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/profile/generate-background Hit");
    next();
  },
  validateRequest(generateProfileBackgroundSchema),
  generateProfileBackground
);

router.get(
  "/background-status/:jobId",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/profile/background-status Hit");
    next();
  },
  validateRequest(getProfileBackgroundGenerationStatusSchema),
  getProfileBackgroundGenerationStatus
);

export default router;
