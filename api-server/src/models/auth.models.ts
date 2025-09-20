import { z } from "zod";

export const loginSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .optional(),
      email: z.email("Invalid email address").optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    })
    .superRefine((data, ctx) => {
      if (!data.name && !data.email) {
        ctx.addIssue({
          code: "custom",
          message: "Either name or email must be provided",
          path: ["name"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Either name or email must be provided",
          path: ["email"],
        });
      }
    }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["CUSTOMER", "ARTIST", "INVESTOR"]),
    professionCode: z.int(),
    businessLocation: z
      .string()
      .min(3, "Business location must be at least 3 characters long")
      .optional(),
  }),
});
