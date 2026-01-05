import z from "zod";

export const addBankAccountSchema = z.object({
  employee_code: z.string({ required_error: "Kode karyawan wajib diisi" }),
  bank_code: z.string({ required_error: "Kode bank wajib diisi" }),
  account_name: z
    .string()
    .min(2, "Nama pemilik rekening wajib diisi minimal 2 karakter")
    .max(100, "Nama pemilik rekening terlalu panjang")
    .trim(),
  account_number: z
    .string({ required_error: "Nomor rekening wajib diisi" })
    .max(30, "Nomor rekening maksimal 30 karakter")
    .trim()
    .regex(/^\d+$/, "Nomor rekening harus berupa angka saja"),
});

export const updateBankAccountSchema = z.object({
  employee_code: z.string().optional(),
  bank_code: z.string({ required_error: "Kode bank wajib diisi" }).optional(),
  account_name: z
    .string()
    .min(2, "Nama pemilik rekening wajib diisi minimal 2 karakter")
    .max(100, "Nama pemilik rekening terlalu panjang")
    .trim(),
  account_number: z
    .string({ required_error: "Nomor rekening wajib diisi" })
    .max(30, "Nomor rekening maksimal 30 karakter")
    .regex(/^\d+$/, "Nomor rekening harus berupa angka saja")
    .optional(),
});
