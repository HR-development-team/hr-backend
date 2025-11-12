import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Ambil ID Karyawan
  const budi = await knex("master_employees")
    .where({ employee_code: "E-001" })
    .first();
  const citra = await knex("master_employees")
    .where({ employee_code: "E-002" })
    .first();

  // 2. Ambil ID Tipe Cuti
  const cutiTahunan = await knex("master_leave_types")
    .where({ name: "Cuti Tahunan" })
    .first();
  const cutiSakit = await knex("master_leave_types")
    .where({ name: "Cuti Sakit" })
    .first();

  if (!budi || !citra || !cutiTahunan || !cutiSakit) {
    console.error("Karyawan atau Tipe Cuti tidak ditemukan.");
    return;
  }

  // 3. Masukkan data balance
  await knex("leave_balances").insert([
    // Saldo Budi
    {
      employee_id: budi.id,
      leave_type_id: cutiTahunan.id,
      balance: 12,
      year: 2025,
    },
    {
      employee_id: budi.id,
      leave_type_id: cutiSakit.id,
      balance: 5,
      year: 2025,
    },
    // Saldo Citra
    {
      employee_id: citra.id,
      leave_type_id: cutiTahunan.id,
      balance: 10, // Sisa 10
      year: 2025,
    },
  ]);
}
