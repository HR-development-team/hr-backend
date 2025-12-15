import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Matikan Foreign Key Check
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

  const tables = [  
    "attendances",
    "attendance_sessions",
    "leave_balances",
    "leave_requests",
    "master_employees",
    "users",
    "master_positions",
    "master_divisions",
    "master_departments",
    "master_offices",
    "master_leave_types",
    "roles",
    "payroll_periods",
  ];

  for (const table of tables) {
    // Cek tabel ada atau tidak biar aman
    const exists = await knex.schema.hasTable(table);
    if (exists) await knex(table).truncate();
  }

  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
  console.log("🧹 Database Cleaned Successfully");
}
