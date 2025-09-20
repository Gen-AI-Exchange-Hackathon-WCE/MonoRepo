import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../utils/reqLogger";
import {
  getInvestmentInterestByStatusSchema,
  getInvestorProfileByIdSchema,
  showArtistsInvestmentInterest,
  updateInvestmentInterestStatusSchema,
  updateInvestorProfileSchema,
} from "../models/investor.models";
import {
  getInvestmentInterestsByStatus,
  showArtistInterestInInvestment,
  updateInvestmentInterestStatus,
  updateInvestorProfile,
} from "../controllers/investor.controller";
import { validateRequest } from "../middlewares/reqValidate.middleware";
import {
  getInvestors,
  getInvestorById,
} from "../controllers/investor.controller";

const router = Router();

router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/investor/ Hit");
    next();
  },
  getInvestors
);

router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("GET /api/investor/:id Hit");
    next();
  },
  validateRequest(getInvestorProfileByIdSchema),
  getInvestorById
);

router.put(
  "/update-profile",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PUT /api/investor/update-profile Hit");
    next();
  },
  validateRequest(updateInvestorProfileSchema),
  updateInvestorProfile
);

router.post(
  "/show-interest",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PUT /api/investor/show-interest Hit");
    next();
  },
  validateRequest(showArtistsInvestmentInterest),
  showArtistInterestInInvestment
);

router.get(
  "/interest/:status",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PUT /api/investor/interest/:status Hit");
    next();
  },
  getInvestmentInterestsByStatus
);

router.patch(
  "/update-status",
  (req: Request, res: Response, next: NextFunction) => {
    logger.info("PUT /api/investor/update-status Hit");
    next();
  },
  validateRequest(updateInvestmentInterestStatusSchema),
  updateInvestmentInterestStatus
);

export default router;
