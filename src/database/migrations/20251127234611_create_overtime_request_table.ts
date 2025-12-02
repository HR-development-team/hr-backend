import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("overtime_requests", (table) => {
    table.increments("id").primary();

    table.string("request_code", 10).notNullable().unique();

    table.string("employee_code", 10).notNullable();

    // === BAGIAN YANG DIPERBAIKI ===
    // Mengarahkan Foreign Key ke tabel 'users' karena tabel 'employees' tidak ada
    table
      .foreign("employee_code")
      .references("user_code")
      .inTable("users") // <--- UBAH DARI "employees" MENJADI "users"
      .onDelete("CASCADE");

    table.date("overtime_date").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.integer("duration").notNullable();
    table.text("reason").notNullable();

    table
      .enum("status", ["Pending", "Approved", "Rejected"])
      .notNullable()
      .defaultTo("Pending");

    table
      .integer("approved_by_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table.timestamp("approval_date");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("overtime_requests");
}
