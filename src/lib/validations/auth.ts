import * as z from "zod"

export const authSchema = z.object({
  fullName: z.string(),
  phone: z.string().min(10, "invalid mobile number").max(10, "invalid mobile number"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(20, {
      message: "Password must be at most 20 characters long",
    }),
})

export const signInSchema = z.object({
  phone: z.string().min(10, "invalid mobile number").max(10, "invalid mobile number"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(20, {
      message: "Password must be at most 20 characters long",
    }),
})

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
})

export const checkPhoneSchema = z.object({
  email: authSchema.shape.phone,
})

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// export type UserPrivateMetadataSchema = z.infer<
//   typeof userPrivateMetadataSchema
// >
