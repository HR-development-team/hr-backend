import z from "zod";

export const addHolidaysSchema = z.object({
  office_code: z.string().optional().nullable(),
  department_code: z.string().optional().nullable(),
  date: z
    .string({
      required_error: "Tanggal libur wajib diisi",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal libur harus YYYY-MM-DD"),
  description: z.string().optional().nullable(),
});

export const updateHolidaysSchema = z.object({
  office_code: z.string().optional().nullable(),
  department_code: z.string().optional().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal libur harus YYYY-MM-DD")
    .optional(),
  description: z.string().optional().nullable(),
});
