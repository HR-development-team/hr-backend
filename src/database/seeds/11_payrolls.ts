// File: seeds/12_payrolls.ts
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Ambil ID Karyawan
  const budi = await knex("master_employees")
    .where({ employee_code: "E-001" })
    .first();
  const citra = await knex("master_employees")
    .where({ employee_code: "E-002" })
    .first();

  // 2. Ambil ID Periode Gaji
  const periodeNov = await knex("payroll_periods")
    .where({ period_code: "NOV2025" })
    .first();

  // 3. Ambil Gaji Pokok dari Posisi
  const posBudi = await knex("master_positions")
    .where({ position_code: "P-BE-JR" })
    .first();
  const posCitra = await knex("master_positions")
    .where({ position_code: "P-FE-SR" })
    .first();

  if (!budi || !citra || !periodeNov || !posBudi || !posCitra) {
    // eslint-disable-next-line no-console
    console.error("Data master untuk payroll seeder tidak lengkap.");
    return;
  }

  await knex("payrolls").insert([
    {
      payroll_period_id: periodeNov.id,
      employee_id: budi.id,
      base_salary: posBudi.base_salary,
      total_work_days: 20, // Asumsi
      total_leave_days: 0,
      total_deductions: 0,
      net_salary: posBudi.base_salary, // Asumsi (gaji utuh)
      generated_at: new Date(),
      status: "draft",
    },
    {
      payroll_period_id: periodeNov.id,
      employee_id: citra.id,
      base_salary: posCitra.base_salary,
      total_work_days: 20, // Asumsi
      total_leave_days: 0,
      total_deductions: 0,
      net_salary: posCitra.base_salary, // Asumsi (gaji utuh)
      generated_at: new Date(),
      status: "draft",
    },
  ]);
}
