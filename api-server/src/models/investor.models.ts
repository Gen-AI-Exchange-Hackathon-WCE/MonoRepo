import { z } from "zod";

export const updateInvestorProfileSchema = z.object({
  phone: z.string().optional(),
  organization: z.string().optional(),
  minInvestment: z.number().nonnegative().optional(),
  maxInvestment: z.number().nonnegative().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  website: z.url().optional(),
  linkedInUrl: z.url().optional(),
  professionCode: z.number().int().optional(),
});

export const showArtistsInvestmentInterest = z.object({
  body: z.object({
    investorId: z.number("Product ID is required").int().positive(),
    message: z.string().optional(),
  }),
});

export const getInvestorProfileByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val, ctx) => {
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

export const getInvestmentInterestByStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
  }),
});

export const updateInvestmentInterestStatusSchema = z.object({
  body: z.object({
    interestId: z.number("Product ID is required").int().positive(),
    isAccepted: z.boolean(),
  }),
});
