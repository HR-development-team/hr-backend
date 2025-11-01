import { z } from "zod";

export const checkInSchema = z
  .object({
    note: z.string().max(255, "Catatan maksimal 255 karakter.").optional(),
  })
  .strict("Field yang tidak diperbolehkan terdeteksi.");

export const checkOutSchema = z
  .object({
    note: z.string().max(255, "Catatan maksimal 255 karakter.").optional(),
  })
  .strict("Field yang tidak diperbolehkan terdeteksi.");
