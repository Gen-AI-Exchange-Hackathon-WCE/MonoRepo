import { z } from "zod";

export const updateUserInfoSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateUserPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  }),
});
