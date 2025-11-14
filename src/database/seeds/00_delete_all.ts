import type { Knex } from "knex";
export async function seed(knex: Knex): Promise<void> {
  // NON-FOREIGN-KEY SAFE DELETE
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

  // TRANSACTION TABLES (yang tergantung employee/user)
  await knex("payrolls").del();
  await knex("leave_requests").del();
  await knex("attendances").del();
  await knex("leave_balances").del();
  await knex("attendance_sessions").del(); // <-- HARUS DIHAPUS SEBELUM users
  await knex("users").del();

  // MASTER DEPENDENT
  await knex("master_employees").del();
  await knex("master_positions").del();
  await knex("master_divisions").del();

  // MASTER INDEPENDENT
  await knex("master_departments").del();
  await knex("master_leave_types").del();
  await knex("payroll_periods").del();

  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
}
