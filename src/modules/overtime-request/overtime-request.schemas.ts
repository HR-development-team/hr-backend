import { z } from "zod";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD.");

const timeString = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu harus HH:mm.");

export const addOvertimeRequestSchema = z
  .object({
    overtime_date: dateString,
    start_time: timeString,
    end_time: timeString,
    reason: z
      .string({ required_error: "Alasan lembur wajib diisi." })
      .min(10, "Alasan minimal 10 karakter.")
      .max(500, "Alasan maksimal 500 karakter."),
  })
  .refine(
    (data) => {
      // Perbaikan: Pakai kutip dua (") pada split
      const [startHour, startMinute] = data.start_time.split(":").map(Number);
      const [endHour, endMinute] = data.end_time.split(":").map(Number);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      return end > start;
    },
    {
      message: "Waktu selesai harus lebih besar dari waktu mulai.",
      path: ["end_time"],
    }
  );

export const updateOvertimeStatusSchema = z.object({
  status: z.enum(["Approved", "Rejected"], {
    required_error: "Status keputusan wajib diisi.",
  }),
});
