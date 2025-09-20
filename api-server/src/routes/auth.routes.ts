import { NextFunction, Response, Request, Router } from "express";
import { logger } from "../utils/reqLogger";
import {
  loginUser,
  registerUser,
  logoutUser,
  verifySession,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../models/auth.models";
import { validateRequest } from "../middlewares/reqValidate.middleware";

const router = Router();

router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/auth/login Hit");
    next();
  },
  validateRequest(loginSchema),
  loginUser
);

router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/auth/register Hit");
    next();
  },
  validateRequest(registerSchema),
  registerUser
);

router.post(
  "/logout",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /api/auth/logout Hit");
    next();
  },
  logoutUser
);

router.get(
  "/verify-session",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/auth/verify-session Hit");
    next();
  },
  verifySession
);

export default router;
