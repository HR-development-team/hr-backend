import { z } from "zod";

export const addMasterDepartmentsSchema = z.object({
  name: z
    .string()
    .min(3, "Nama departemen minimal 3 karakter")
    .max(100, "Nama departemen maksimal 100 karakter"),
});

export const updateMasterDepartmentsSchema = z.object({
  name: z
    .string()
    .min(3, "Nama departemen minimal 3 karakter")
    .max(100, "Nama departemen maksimal 100 karakter")
    .optional(),
});
