// status.schemas.ts
import { z } from "zod";

export const addEmploymentStatusSchema = z.object({
  // status_code dihapus karena auto-generate
  name: z
    .string({ required_error: "Nama status wajib diisi" })
    .min(1, "Nama status minimal 1 karakter")
    .max(100, "Nama status maksimal 100 karakter"),
  description: z.string().nullable().optional(),
});

export const updateEmploymentStatusSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama status minimal 1 karakter")
      .max(100, "Nama status maksimal 100 karakter")
      .optional(),
    description: z.string().nullable().optional(),
  })
  .strict("Terdapat field yang tidak diperbolehkan.")
  .refine((data) => Object.keys(data).length > 0, {
    message: "Setidaknya satu field harus diisi untuk pembaruan.",
    path: ["body"],
  });