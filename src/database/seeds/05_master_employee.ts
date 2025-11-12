import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_employees").insert([
    {
      employee_code: "E-001",
      position_code: "P-BE-JR",
      full_name: "Budi Santoso",
      ktp_number: "3201112223330001",
      join_date: "2025-01-15",
      employment_status: "aktif",
      gender: "laki-laki",
      contact_phone: "091234567890",
    },
    {
      employee_code: "E-002",
      position_code: "P-FE-SR",
      full_name: "Citra Lestari",
      ktp_number: "3201112223330002",
      join_date: "2023-03-10",
      employment_status: "aktif",
      gender: "perempuan",
      contact_phone: "081234567891",
    },
    {
      employee_code: "E-003",
      position_code: "P-HR-STAFF",
      full_name: "Admin Perusahaan",
      ktp_number: "3201112223330003",
      join_date: "2024-01-01",
      employment_status: "aktif",
      gender: "perempuan",
      contact_phone: "081234567892",
    },
  ]);
}
