import { z } from "zod";

export const addRolesSchema = z.object({
  name: z
    .string({
      required_error: "Nama peran (Role) wajib diisi",
    })
    .min(3, "Nama peran minimal 3 karakter")
    .max(50, "Nama peran maksimal 50 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional(),
});

export const UpdateRoleSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama peran minimal 3 karakter")
      .max(50, "Nama peran maksimal 50 karakter")
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
