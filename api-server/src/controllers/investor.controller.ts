import { Request, Response } from "express";
import { ApiResponse, ApiError } from "../config/api.config";
import { dbClient } from "../config/prisma.config";
import { logger } from "../utils/reqLogger";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const updateInvestorProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const investorId = Number(authReq.userId);

    const {
      phone,
      organization,
      investmentFocus,
      minInvestment,
      maxInvestment,
      location,
      description,
      website,
      linkedInUrl,
      investmentFocusCode,
    } = req.body;

    const updatedInvestor = await dbClient.investor.update({
      where: { id: investorId },
      data: {
        ...(phone && { phone }),
        ...(organization && { organization }),
        ...(investmentFocus && { investmentFocus }),
        ...(minInvestment !== undefined && { minInvestment }),
        ...(maxInvestment !== undefined && { maxInvestment }),
        ...(location && { location }),
        ...(description && { description }),
        ...(website && { website }),
        ...(linkedInUrl && { linkedInUrl }),
        investmentFocus: investmentFocusCode
          ? { connect: { code: investmentFocusCode } }
          : undefined,
      },
    });

    if (!updatedInvestor) {
      const err = new ApiError(
        404,
        "Investor not found",
        [],
        "No investor exists with this ID"
      );
      logger.error("Error updating investor profile");
      res.status(err.statusCode).json(err);
      return;
    }

    const response = new ApiResponse(
      200,
      updatedInvestor,
      "Investor profile updated successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error updating investor profile", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getInvestors = async (req: Request, res: Response) => {
  try {
    const { professionId, location, minInvestment, maxInvestment } = req.query;

    const investors = await dbClient.investor.findMany({
      where: {
        ...(professionId && {
          investmentFocus: { code: Number(professionId) },
        }),
        ...(location && { location: String(location) }),
        ...(minInvestment && { minInvestment: { gte: Number(minInvestment) } }),
        ...(maxInvestment && { maxInvestment: { lte: Number(maxInvestment) } }),
      },
      include: {
        investmentFocus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = new ApiResponse(
      200,
      investors,
      "Investors fetched successfully"
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
    logger.error("Error fetching investors", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getInvestorById = async (req: Request, res: Response) => {
  try {
    const investorId = Number(req.params.id);

    const investor = await dbClient.investor.findUnique({
      where: { id: investorId },
      include: {
        investmentFocus: true,
      },
    });

    if (!investor) {
      const err = new ApiError(404, "Investor not found", [
        "No investor found with this ID",
      ]);
      return res.status(err.statusCode).json(err);
    }

    const response = new ApiResponse(
      200,
      investor,
      "Investor fetched successfully"
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
    logger.error("Error fetching investor by ID", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const showArtistInterestInInvestment = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const artistId = Number(authReq.userId);

    const { investorId, message } = req.body;

    const newInterest = await dbClient.investorInterest.create({
      data: {
        artistId: artistId,
        investorId: investorId,
        message: message,
      },
    });

    if (!newInterest) {
      const err = new ApiError(
        500,
        "Failed to create investor invest",
        [],
        "Investor interest creation returned null"
      );
      logger.error("Error creating investor interest");
      res.status(err.statusCode).json(err);
      return;
    }

    const response = new ApiResponse(
      201,
      newInterest,
      "Interest registred successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error regestering interest investment", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const getInvestmentInterestsByStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const investorId = Number(authReq.userId);

    const { status } = req.params;

    const filteredInterests = await dbClient.investorInterest.findMany({
      where: { investorId: investorId, status: status },
      include: {
        artist: {
          include: {
            profile: true,
          },
        },
      },
    });

    const response = new ApiResponse(
      200,
      filteredInterests,
      "Fetched interests by status successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error fetching investment interest by status", error);
    res.status(err.statusCode).json(err);
    return;
  }
};

export const updateInvestmentInterestStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { interestId, isAccepted } = req.body;

    const updatedInterest = await dbClient.investorInterest.update({
      where: { id: interestId },
      data: {
        status: isAccepted ? "ACCEPTED" : "REJECTED",
      },
    });

    const response = new ApiResponse(
      201,
      updatedInterest,
      "Updated Interest Status Successfully"
    );
    res.status(response.statusCode).json(response);
    return;
  } catch (error: any) {
    const err = new ApiError(
      500,
      error.message || "Internal Sever Error",
      [],
      error.stack
    );
    logger.error("Error updating investment interest status", error);
    res.status(err.statusCode).json(err);
    return;
  }
};
