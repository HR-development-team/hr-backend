import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("roles").insert([
    {
      role_code: "ROL0000001",
      name: "Super Admin",
      description: "Full Access",
    },
    {
      role_code: "ROL0000002",
      name: "Branch Admin",
      description: "Branch Office Admin",
    },
    {
      role_code: "ROL0000003",
      name: "Employee",
      description: "Employee Office",
    },
  ]);
}
