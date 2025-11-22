import { z } from "zod";

// Defines the minimum required date string format (ISO 8601: YYYY-MM-DD)
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD.");

export const addPayrollPeriodsSchema = z.object({
  period_code: z
    .string({ required_error: "Kode periode payroll wajib diisi" })
    .min(3, "Kode periode payroll minimal 3 karakter")
    .max(100, "Kode periode payroll maksimal 100 karakter"),
  start_date: dateString.min(10, "Tanggal mulai periode payroll wajib diisi."),
  end_date: dateString.min(10, "Tanggal selesai periode payroll wajib diisi."),
});

export const updatePayrollPeriodsStatusSchema = z.object({
  status: z.enum(["processing", "finalized", "paid", "canceled"], {
    required_error: "Status wajib diisi",
  }),
});
