import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data dalam urutan terbalik dari dependensi
  // (Tabel yang bergantung pada tabel lain dihapus lebih dulu)

  // Tabel transaksi
  await knex("payrolls").del();
  await knex("leave_requests").del();
  await knex("attendances").del();
  await knex("leave_balances").del();
  await knex("users").del();
  await knex("attendance_sessions").del();

  // Tabel master dependen
  await knex("master_employees").del();
  await knex("master_positions").del();
  await knex("master_divisions").del();

  // Tabel master independen
  await knex("master_departments").del();
  await knex("master_leave_types").del();
  await knex("payroll_periods").del();
}
