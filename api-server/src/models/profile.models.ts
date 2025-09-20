import { z } from "zod";

export const getProfileInfoSchema = z.object({
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

export const generateProfileDescriptionSchema = z.object({
  body: z.object({
    background_text: z
      .string()
      .min(10, "Background text must be at least 10 characters long"),
    experience_text: z
      .string()
      .min(10, "Experience text must be at least 10 characters long"),
    custom_req_text: z.string().optional(),
  }),
});

export const generateProfileBackgroundSchema = z.object({
  body: z.object({
    background_text: z
      .string()
      .min(10, "Background text must be at least 10 characters long"),
    experience_text: z
      .string()
      .min(10, "Experience text must be at least 10 characters long"),
    custom_req_text: z.string().optional(),
  }),
});

export const getProfileBackgroundGenerationStatusSchema = z.object({
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
