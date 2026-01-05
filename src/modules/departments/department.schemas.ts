import { z } from "zod";
  
export const addMasterDepartmentsSchema = z.object({
  office_code: z.string({ required_error: "Office code wajib diisi" }),
  name: z
    .string()
    .min(3, "Nama departemen minimal 3 karakter")
    .max(100, "Nama departemen maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional(),
});

export const updateMasterDepartmentsSchema = z
  .object({
    office_code: z.string().optional(),
    name: z
      .string()
      .min(3, "Nama departemen minimal 3 karakter")
      .max(100, "Nama departemen maksimal 100 karakter")
      .optional(),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter.")
      .optional(),
  })
  .strict("Terdapat field yang tidak diperbolehkan.")
  .refine((data) => Object.keys(data).length > 0, {
    message: "Setidaknya satu field(nama) harus diisi untuk pembaruan.",
    path: ["body"],
  });
