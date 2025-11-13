import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_positions").insert([
    {
      position_code: "PST0000001",
      division_code: "DVS0000001", // Sebelumnya "D-TEK-BE"
      name: "Backend Developer", // Sesuai JSON
      base_salary: 8000000, // Memperbaiki typo 800000
      description:
        "Developer yang berugas dalam pengembangan logika bisnis aplikasi",
    },
    {
      position_code: "PST0000002",
      division_code: "DVS0000002", // Sebelumnya "D-TEK-FE"
      name: "Frontend Developer", // Disesuaikan
      base_salary: 15000000,
      description:
        "Developer yang bertugas dalam pengembangan antarmuka pengguna.",
    },
    {
      position_code: "PST0000003",
      division_code: "DVS0000003", // Sebelumnya "D-HR-PAY"
      name: "HR Staff",
      base_salary: 7500000,
      description: "Staf yang bertugas mengurus administrasi HR dan payroll.",
    },
  ]);
}
