import { z } from "zod";

export const addMasterPositionsSchema = z.object({
  parent_position_code: z
    .string()
    .length(10, "Kode induk jabatan harus tepat 10 karakter")
    .optional()
    .nullable(),
  name: z
    .string({
      required_error: "Nama wajib diisi",
    })
    .min(3, "Nama posisi minimal 3 karakter")
    .max(100, "Nama posisi maksimal 100 karakter"),
  division_code: z
    .string()
    .length(10, "Kode divisi harus tepat 10 karakter")
    .nullable(),
  department_code: z
    .string()
    .length(10, "Kode department maksimal 10 karakter")
    .nullable(),
  base_salary: z
    .number({
      invalid_type_error: "Gaji pokok harus berupa angka.",
      required_error: "Gaji pokok wajib diisi.",
    })
    .min(1000000, "Gaji pokok minimal 1.000.000")
    .max(100000000, "Gaji pokok maksimal 100.000.000"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .optional(),
});

export const createOfficePositionSchema = z.object({
  office_code: z
    .string({ required_error: "Kode kantor wajib diisi" })
    .length(10, "Kode kantor maksimal 10"),
  name: z
    .string({ required_error: "Nama jabatan wajib diisi" })
    .min(3, "Nama jabatan minimal 3 karakter")
    .max(100, "Nama jabatan maksimal 100 karakter"),

  base_salary: z
    .number({
      invalid_type_error: "Gaji pokok harus berupa angka",
      required_error: "Gaji pokok wajib diisi",
    })
    .min(1000000, "Gaji pokok minimal 1.000.000"),

  // Parent Position (Atasan) opsional (misal CEO tidak punya atasan)
  parent_position_code: z
    .string()
    .length(10, "Kode atasan harus 10 karakter")
    .optional()
    .nullable(),

  description: z.string().max(500).optional(),
});

export const createDepartmentPositionSchema = z.object({
  department_code: z
    .string({ required_error: "Kode departemen wajib diisi" })
    .length(10, "Kode departemen harus tepat 10 karakter"),

  name: z
    .string({ required_error: "Nama jabatan wajib diisi" })
    .min(3, "Nama jabatan minimal 3 karakter")
    .max(100, "Nama jabatan maksimal 100 karakter"),

  base_salary: z
    .number({
      invalid_type_error: "Gaji pokok harus berupa angka",
      required_error: "Gaji pokok wajib diisi",
    })
    .min(1000000, "Gaji pokok minimal 1.000.000"),
  description: z.string().max(500).optional(),
});

export const createDivisionPositionSchema = z.object({
  division_code: z
    .string({ required_error: "Kode divisi wajib diisi" })
    .length(10, "Kode divisi harus tepat 10 karakter"),

  name: z
    .string({ required_error: "Nama jabatan wajib diisi" })
    .min(3, "Nama jabatan minimal 3 karakter")
    .max(100, "Nama jabatan maksimal 100 karakter"),

  base_salary: z
    .number({
      invalid_type_error: "Gaji pokok harus berupa angka",
      required_error: "Gaji pokok wajib diisi",
    })
    .min(1000000, "Gaji pokok minimal 1.000.000"),
  description: z.string().max(500).optional(),
});

export const updateMasterPositionsSchema = z
  .object({
    parent_position_code: z
      .string()
      .length(10, "Kode induk posisi harus tepat 10 karakter")
      .optional()
      .nullable(),
    name: z
      .string()
      .min(3, "Nama posisi minimal 3 karakter")
      .max(100, "Nama posisi maksimal 100 karakter")
      .optional(),
    division_code: z
      .string()
      .length(10, "Kode divisi harus tepat 10 karakter")
      .optional()
      .nullable(),
    department_code: z
      .string()
      .length(10, "Kode department maksimal 10 karakter")
      .optional()
      .nullable(),
    base_salary: z
      .number({
        invalid_type_error: "Gaji pokok harus berupa angka.",
        required_error: "Gaji pokok wajib diisi.",
      })
      .min(1000000, "Gaji pokok minimal 1.000.000")
      .max(100000000, "Gaji pokok maksimal 100.000.000")
      .optional(),
    sort_order: z
      .number({
        invalid_type_error: "Urutan pengurutan harus berupa angka",
      })
      .min(1)
      .optional(),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter.")
      .optional()
      .nullable(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "Setidaknya satu field (name atau department_id) harus diisi untuk pembaruan.",
    path: ["body"],
  });
