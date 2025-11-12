import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Ambil ID Karyawan
  const citra = await knex("master_employees")
    .where({ employee_code: "E-002" })
    .first();

  // 2. Ambil ID Tipe Cuti
  const cutiTahunan = await knex("master_leave_types")
    .where({ name: "Cuti Tahunan" })
    .first();

  // 3. Ambil ID User (Admin) untuk approval
  const adminUser = await knex("users").where({ user_code: "U-003" }).first();

  if (!citra || !cutiTahunan || !adminUser) {
    console.error("Data untuk Leave Request tidak lengkap.");
    return;
  }

  await knex("leave_requests").insert([
    {
      employee_id: citra.id,
      leave_type_id: cutiTahunan.id,
      start_date: "2025-10-20",
      end_date: "2025-10-21",
      total_days: 2,
      reason: "Acara keluarga.",
      status: "Approved",
      approved_by_id: adminUser.id,
      approval_date: new Date(),
    },
    {
      employee_id: citra.id,
      leave_type_id: cutiTahunan.id,
      start_date: "2025-11-15",
      end_date: "2025-11-15",
      total_days: 1,
      reason: "Menghadiri pernikahan teman.",
      status: "Pending",
    },
  ]);
}
