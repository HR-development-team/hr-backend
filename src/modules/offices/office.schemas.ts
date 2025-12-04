import { z } from "zod";

// Validasi untuk Create
export const addMasterOfficeSchema = z.object({
  parent_office_code: z.string().optional().nullable(),
  name: z.string().min(1, "Nama wajib diisi").max(100, "Maksimal 100 karakter"),
  address: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(500, "Maksimal 500 karakter"),
  latitude: z.number({ invalid_type_error: "Latitude harus berupa angka" }),
  longitude: z.number({ invalid_type_error: "Longitude harus berupa angka" }),
  radius_meters: z.number().int().positive().optional().default(50),
  sort_order: z.number().int().positive().optional(),
  description: z.string().max(1000).optional(),
});

// Validasi untuk Update (Partial)
export const updateMasterOfficeSchema = addMasterOfficeSchema.partial();
