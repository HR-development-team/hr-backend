import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("roles").insert([
    { role_code: "ROL0000001", name: "SuperAdmin", description: "Full Access" },
    { role_code: "ROL0000002", name: "SystemAdmin", description: "Tech Admin" },
    {
      role_code: "ROL0000003",
      name: "HeadOfficeStaff",
      description: "HO Staff",
    },
    {
      role_code: "ROL0000004",
      name: "BranchManager",
      description: "Branch Lead",
    },
    { role_code: "ROL0000005", name: "OfficeStaff", description: "Staff" },
    { role_code: "ROL0000006", name: "Auditor", description: "ReadOnly" },
  ]);
}
