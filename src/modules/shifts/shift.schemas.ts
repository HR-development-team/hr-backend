import { z } from "zod";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export const addMasterShiftSchema = z
  .object({
    office_code: z.string({
      required_error: "Kode kantor wajib diisi",
      invalid_type_error: "Kode kantor harus berupa string",
    }),
    name: z
      .string({
        required_error: "Nama shift wajib diisi",
      })
      .min(3, "Nama shift minimal 3 karakter")
      .max(100, "Nama shift maksimal 50 karakter"),
    start_time: z
      .string({
        required_error: "Waktu mulai (start_time) wajib diisi",
      })
      .regex(timeRegex, "Format waktu mulai tidak valid (gunakan HH:mm:ss)"),

    end_time: z
      .string({
        required_error: "Waktu selesai (end_time) wajib diisi",
      })
      .regex(timeRegex, "Format waktu selesai tidak valid (gunakan HH:mm:ss)"),

    is_overnight: z
      .boolean({
        invalid_type_error: "is_overnight harus berupa boolean (true/false)",
      })
      .optional()
      .default(false),
    late_tolerance_minutes: z
      .number({
        invalid_type_error: "Toleransi keterlambatan harus berupa angka",
      })
      .int("Toleransi harus berupa bilangan bulat")
      .min(0, "Toleransi minimal 0 menit"),

    check_in_limit_minutes: z
      .number({
        invalid_type_error: "Batas check-in harus berupa angka",
      })
      .int("Batas harus berupa bilangan bulat")
      .positive()
      .min(30, "Batas check-in minimal harus 30 menit"),

    check_out_limit_minutes: z
      .number({
        invalid_type_error: "Batas check-out harus berupa angka",
      })
      .int("Batas harus berupa bilangan bulat")
      .positive()
      .min(30, "Batas check-out minimal harus 30 menit"),
    work_days: z
      .array(
        z
          .number()
          .int("Hari harus berupa bilangan bulat")
          .min(0, "Angka terkecil adalah 0 (Minggu")
          .max(6, "Angka terbesar adalah 6 (Sabtu")
      )
      .min(1, "Setidaknya harus ada satu hari kerja yang dipilih")
      .max(7, "Maksimal tujuh hari kerja yang dapat dipilih")
      .refine((items) => new Set(items).size === items.length, {
        message: "Tidak boleh ada hari kerja yang duplikat dalam satu shift",
      }),
  })
  .refine(
    (data) => {
      // Custom refinement to ensure start_time is not equal to end_time for non-overnight shifts
      if (!data.is_overnight && data.start_time === data.end_time) {
        return false;
      }
      return true;
    },
    {
      message:
        "Waktu mulai dan waktu selesai tidak boleh sama untuk shift normal (non-overnight).",
      path: ["start_time", "end_time"],
    }
  );

export const updateMasterShiftSchema = z
  .object({
    office_code: z.string().optional(),
    name: z
      .string()
      .min(3, "Nama shift minimal 3 karakter")
      .max(100, "Nama shift maksimal 50 karakter")
      .optional(),

    start_time: z
      .string()
      .regex(timeRegex, "Format waktu mulai tidak valid (gunakan HH:mm:ss)")
      .optional(),

    end_time: z
      .string()
      .regex(timeRegex, "Format waktu selesai tidak valid (gunakan HH:mm:ss)")
      .optional(),

    is_overnight: z.boolean().optional(),

    late_tolerance_minutes: z
      .number()
      .int("Toleransi harus berupa bilangan bulat")
      .min(0, "Toleransi minimal 0 menit")
      .optional(),

    check_in_limit_minutes: z
      .number()
      .int("Batas check-in harus berupa bilangan bulat")
      .min(30, "Batas check-in minimal 30 menit")
      .positive()
      .optional(),

    check_out_limit_minutes: z
      .number()
      .int("Batas check-out harus berupa bilangan bulat")
      .min(30, "Batas check-out minimal 30 menit")
      .positive()
      .optional(),
    work_days: z
      .array(
        z
          .number()
          .int("Hari harus berupa bilangan bulat")
          .min(0, "Angka terkecil adalah 0 (Minggu")
          .max(6, "Angka terbesar adalah 6 (Sabtu")
      )
      .min(1, "Setidaknya harus ada satu hari kerja yang dipilih")
      .max(7, "Maksimal tujuh hari kerja yang dapat dipilih")
      .refine((items) => new Set(items).size === items.length, {
        message: "Tidak boleh ada hari kerja yang duplikat dalam satu shift",
      })
      .optional(),
  })
  .strict("Terdapat field yang tidak diperbolehkan.")
  .refine((data) => Object.keys(data).length > 0, {
    message: "Setidaknya satu field harus diisi untuk pembaruan data shift.",
    path: ["body"],
  })
  .refine(
    (data) => {
      if (!data.is_overnight && data.start_time === data.end_time) {
        return false;
      }
      return true;
    },
    {
      message:
        "Waktu mulai dan waktu selesai tidak boleh sama untuk shift normal (non-overnight).",
      path: ["start_time", "end_time"],
    }
  );
