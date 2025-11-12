import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    {
      user_code: "U-001",
      email: "budi.santoso@example.com",
      password: "password123",
      role: "employee",
      employee_code: "E-001",
    },
    {
      user_code: "U-002",
      email: "citra_lestari@example.com",
      password: "password123",
      employee_code: "E-002",
    },
    {
      user_code: "U-003",
      email: "admin.hr@example.com",
      password: "ejfnaf",
      role: "admin",
      employee_code: "E-003",
    },
  ]);
}
