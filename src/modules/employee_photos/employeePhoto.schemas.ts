import { z } from "zod";

export const uploadPhotoSchema = z.object({
  params: z.object({
    employee_code: z
      .string()
      .min(1, "Employee code is required")
      .max(10, "Employee code max 10 characters"),
  }),
});

export const getPhotoSchema = z.object({
  params: z.object({
    employee_code: z
      .string()
      .min(1, "Employee code is required")
      .max(10, "Employee code max 10 characters"),
  }),
});

export const deletePhotoSchema = z.object({
  params: z.object({
    employee_code: z
      .string()
      .min(1, "Employee code is required")
      .max(10, "Employee code max 10 characters"),
  }),
});