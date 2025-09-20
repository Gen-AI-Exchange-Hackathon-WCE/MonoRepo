import { ZodObject, ZodError } from "zod";
import { ApiError } from "../config/api.config";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validateRequest =
  (schema: ZodObject<any>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(
          new ApiError(
            400,
            "Validation Error",
            error.issues.map((err) => err.message)
          )
        );
        return next();
      }
      res
        .status(500)
        .json(
          new ApiError(
            500,
            "Internal Server Error",
            [],
            error instanceof Error ? error.stack : undefined
          )
        );
      return next();
    }
  };
