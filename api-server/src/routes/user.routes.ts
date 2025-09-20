import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middlewares/reqValidate.middleware";
import {
  updateUserInfo,
  updateUserPassword,
} from "../controllers/user.controller";
import {
  updateUserInfoSchema,
  updateUserPasswordSchema,
} from "../models/user.model";
import { logger } from "../utils/reqLogger";

const router = Router();

router.patch(
  "/update-info",
  validateRequest(updateUserInfoSchema),
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PATCH /api/user/update-info Hit");
    next();
  },
  updateUserInfo
);

router.patch(
  "/update-password",
  validateRequest(updateUserPasswordSchema),
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PATCH /api/user/update-password Hit");
    next();
  },
  updateUserPassword
);

export default router;
