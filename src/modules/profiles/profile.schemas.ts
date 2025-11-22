import z from "zod";

export const updateProfileSchema = z
  .object({
    full_name: z
      .string({ required_error: "Nama panjang wajib diisi" })
      .min(3, "Nama panjang minimal 3 karakter")
      .max(100, "Nama panjang maksimal 100 karakter")
      .optional(),
    ktp_number: z
      .string()
      .length(16, "Nomer KTP harus tepat 16 karakter")
      .nullable()
      .optional(),
    birth_place: z
      .string()
      .min(3, "Tempat lahir minimal 3 karakter")
      .max(100, "Tempat lahir maksimal 100 karakter")
      .nullable()
      .optional(),
    birth_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal lahir harus YYYY-MM-DD")
      .nullable()
      .optional(),
    gender: z.enum(["laki-laki", "perempuan"]).nullable().optional(),
    address: z.string().nullable().optional(),
    contact_phone: z
      .string()
      .min(3, "Nomor telepon minimal 3 karakter")
      .max(20, "Nomor telepon maksimal 20 karakter")
      .nullable()
      .optional(),
    religion: z.string().nullable().optional(),
    maritial_status: z.string().nullable().optional(),
    resign_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal resign harus YYYY-MM-DD")
      .nullable()
      .optional(),
    employment_status: z
      .enum(["aktif", "inaktif"])
      .default("aktif")
      .nullable()
      .optional(),
    education: z
      .string()
      .min(2, "Pendidikan minimal 2 karakter")
      .max(50, "Pendidikan maksimal 50 karakter")
      .nullable()
      .optional(),
    blood_type: z
      .string()
      .min(1, "Golongan darah minimal 1 karakter")
      .max(5, "Golongan darah maksimal 5 karakter")
      .nullable()
      .optional(),
    profile_picture: z
      .string()
      .max(255, "Nama file/profile maksimal 255 karakter")
      .nullable()
      .optional(),
    bpjs_ketenagakerjaan: z
      .string()
      .min(3, "BPJS Ketenagakerjaan minimal 3 karakter")
      .max(50, "BPJS Ketenagakerjaan maksimal 50 karakter")
      .nullable()
      .optional(),
    bpjs_kesehatan: z
      .string()
      .min(3, "BPJS Kesehatan minimal 3 karakter")
      .max(50, "BPJS Kesehatan maksimal 50 karakter")
      .nullable()
      .optional(),
    npwp: z
      .string()
      .min(3, "NPWP minimal 3 karakter")
      .max(50, "NPWP maksimal 50 karakter")
      .nullable()
      .optional(),
    bank_account: z
      .string()
      .min(3, "Nomor rekening minimal 3 karakter")
      .max(50, "Nomor rekening maksimal 50 karakter")
      .nullable()
      .optional(),
  })
  .strict("Terdapat field yang tidak diperbolehkan.") // Disallows extra fields
  .refine((data) => Object.keys(data).length > 0, {
    message: "Setidaknya satu field harus diisi untuk pembaruan.",
    path: ["body"],
  });
