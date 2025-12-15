import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_leave_types").insert([
    {
      name: "Cuti Tahunan",
      type_code: "TCT0000001",
      deduction: 10000,
      description: "Annual",
    },
    {
      name: "Cuti Sakit",
      type_code: "TCT0000002",
      deduction: 0,
      description: "Sick",
    },
  ]);
}
