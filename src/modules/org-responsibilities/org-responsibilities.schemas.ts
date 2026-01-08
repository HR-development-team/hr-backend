import z from "zod";

export const addOrgResponsibilitiesSchema = z.object({
  scope_type: z.enum(["office", "department", "division"], {
    errorMap: () => ({
      message:
        "Scope type harus diantara 'office', 'department', atau 'division'",
    }),
  }),
  scope_code: z.string({ required_error: "scope code wajib diisi" }),
  employee_code: z.string({ required_error: "employee code wajib diisi" }),
  role: z
    .string({ required_error: "Nama role wajib diisi" })
    .min(3, "Nama role minimal 3 karakter")
    .max(100, "Nama role terlalu panjang"),
  start_date: z
    .string()
    .date("Tanggal mulai menjabat harus berformat (YYYY-MM-DD)"),
});

export const updateOrgResponsibilitiesSchema = z.object({
  role: z
    .string()
    .min(3, "Nama role minimal 3 karakter")
    .max(100, "Nama role terlalu panjang")
    .optional(),
  start_date: z
    .string()
    .date("Tanggal mulai menjabat harus berformat (YYYY-MM-DD)")
    .optional(),
  end_date: z
    .string()
    .date("Tangggal akhir menjabat harus berformat (YYYY-MM-DD)")
    .optional()
    .nullable(),
});

export const unassignLeaderSchema = z
  .object({
    scope_type: z.enum(["office", "department", "division"], {
      errorMap: () => ({
        message:
          "Scope type harus diantara 'office', 'department', atau 'division'",
      }),
    }),
    scope_code: z.string({ required_error: "scope code wajib diisi" }),
    end_date: z
      .string()
      .date("Tangggal akhir menjabat harus berformat (YYYY-MM-DD)")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Setidaknya satu field harus diisi untuk pembaruan.",
    path: ["body"],
  });
