import { z } from "zod";

export const PermissionItemSchema = z.object({
  feature_code: z.string({
    required_error: "Feature Code wajib diisi.",
  }),
  can_create: z.boolean().default(false),
  can_read: z.boolean().default(false),
  can_update: z.boolean().default(false),
  can_delete: z.boolean().default(false),
  can_print: z.boolean().default(false),
});

export const UpdatePermissionSchema = z
  .object({
    permissions: z
      .array(PermissionItemSchema)
      .min(1, { message: "Setidaknya satu permission harus disertakan." }),
  })
  .strict()
  .refine((data) => Object.keys(data).includes("permissions"), {
    message: "Field 'permissions' wajib diisi.",
    path: ["body"],
  });
