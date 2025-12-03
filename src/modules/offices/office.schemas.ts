import { z } from "zod";

export const addMasterOfficeSchema = z.object({
  name: z
    .string({
      required_error: "Nama kantor wajib diisi",
    })
    .min(3, "Nama kantor minimal 3 karakter")
    .max(100, "Nama kantor maksimal 100 karakter"),

  address: z
    .string({
      required_error: "Alamat kantor wajib diisi",
    })
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter"),

  latitude: z
    .number({
      required_error: "Latitude wajib diisi",
      invalid_type_error: "Latitude harus berupa angka desimal",
    })
    .min(-90, "Latitude tidak valid (min -90)")
    .max(90, "Latitude tidak valid (max 90)"),

  longitude: z
    .number({
      required_error: "Longitude wajib diisi",
      invalid_type_error: "Longitude harus berupa angka desimal",
    })
    .min(-180, "Longitude tidak valid (min -180)")
    .max(180, "Longitude tidak valid (max 180)"),

  radius_meters: z
    .number({
      invalid_type_error: "Radius harus berupa angka",
    })
    .int("Radius harus berupa angka bulat (meter)")
    .min(10, "Radius minimal 10 meter")
    .max(5000, "Radius maksimal 5000 meter (5km)"),
});

export const updateMasterOfficeSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama kantor minimal 3 karakter")
      .max(100, "Nama kantor maksimal 100 karakter")
      .optional(),

    address: z
      .string()
      .min(10, "Alamat minimal 10 karakter")
      .max(500, "Alamat maksimal 500 karakter")
      .optional(),

    latitude: z
      .number({
        invalid_type_error: "Latitude harus berupa angka desimal",
      })
      .min(-90, "Latitude tidak valid (min -90)")
      .max(90, "Latitude tidak valid (max 90)")
      .optional(),

    longitude: z
      .number({
        invalid_type_error: "Longitude harus berupa angka desimal",
      })
      .min(-180, "Longitude tidak valid (min -180)")
      .max(180, "Longitude tidak valid (max 180)")
      .optional(),

    radius_meters: z
      .number({
        invalid_type_error: "Radius harus berupa angka",
      })
      .int("Radius harus berupa angka bulat (meter)")
      .min(10, "Radius minimal 10 meter")
      .max(5000, "Radius maksimal 5000 meter (5km)")
      .optional(),

    parent_office_code: z
      .string()
      .length(10, "Kode parent harus 10 karakter")
      .optional()
      .nullable(),
  })

  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "Setidaknya satu field (name, address, latitude, longitude, atau radius) harus diisi untuk pembaruan.",
    path: ["body"],
  });
