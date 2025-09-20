import { NextFunction, Router, Request, Response } from "express";
import { logger } from "../utils/reqLogger";
import { getHealth } from "../controllers/example.controllers";

const router = Router();

router.get(
  "/health",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/health called");
    next();
  },
  getHealth
);

export default router;
