import { z } from "zod";

export const addFeaturesSchema = z.object({
  name: z
    .string({
      required_error: "Nama fitur wajib diisi",
    })
    .min(3, "Nama fitur minimal 3 karakter")
    .max(50, "Nama fitur maksimal 50 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional(),
});

export const UpdateFeaturesSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama fitur minimal 3 karakter")
      .max(50, "Nama fitur maksimal 50 karakter")
      .optional(),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter.")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "Setidaknya satu field (nama atau deskripsi) harus diisi untuk pembaruan.",
    path: ["body"],
  });
