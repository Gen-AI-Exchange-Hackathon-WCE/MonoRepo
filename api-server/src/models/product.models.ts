import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const getProductSchema = z.object({
  params: z.object({
    productId: z.string().transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid artist ID format",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const getProductByArtistIdSchema = z.object({
  params: z.object({
    artistId: z.string().transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid artist ID format",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const createNewCategorySchema = z.object({
  body: z.object({
    categoryName: z.string(),
    categoryDescription: z.string().optional(),
  }),
});

export const parseProductFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert numbers
    if (req.body.categoryId) req.body.categoryId = Number(req.body.categoryId);
    if (req.body.productPrice)
      req.body.productPrice = Number(req.body.productPrice);

    // Colors and sizes are already arrays (from FormData)
    if (
      req.body.availableColors &&
      typeof req.body.availableColors === "string"
    ) {
      req.body.availableColors = (req.body.availableColors as string)
        .split(",")
        .map((c) => c.trim());
    }

    if (req.body.sizes && typeof req.body.sizes === "string") {
      req.body.sizes = (req.body.sizes as string)
        .split(",")
        .map((s) => s.trim());
    }

    // Parse dimensions JSON only
    if (req.body.dimensions && typeof req.body.dimensions === "string") {
      req.body.dimensions = JSON.parse(req.body.dimensions as string);
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

export const listNewProductSchema = z.object({
  body: z.object({
    categoryId: z.number("CategoryId is required").int().positive(),
    productName: z.string("ProductName is required").min(1),
    productDescription: z.string().optional(),
    productPrice: z.number("ProductPrice is required").positive(),
    availableColors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    dimensions: z
      .object({
        width: z.number().optional(),
        height: z.number().optional(),
        depth: z.number().optional(),
      })
      .optional(),
    materialType: z.string().optional(),
  }),
});

export const generateProductDescriptionSchema = z.object({
  body: z.object({
    productId: z.number("Product ID is required").int().positive(),
    custom_req: z.string().optional(),
  }),
});

export const acceptProductDescriptionSchema = z.object({
  body: z.object({
    productId: z.number("Product ID is required").int().positive(),
  }),
});

export const getProductMediaGenerationStatusSchema = z.object({
  params: z.object({
    jobId: z.string().transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid artist ID format",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  }),
});

export const generateProductShootSchema = z.object({
  body: z.object({
    productId: z.number("Product ID is required").int().positive(),
  }),
});

export const generateProductKeywordsSchema = z.object({
  body: z.object({
    productId: z.number("Product ID is required").int().positive(),
  }),
});
