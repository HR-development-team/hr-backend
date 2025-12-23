import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attendances", (table) => {
    table.dropForeign(["session_code"]);
    table.dropColumn("session_code");

    table.string("shift_code", 10).notNullable().index();

    table
      .foreign("shift_code")
      .references("shift_code")
      .inTable("master_shifts")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");

    table.date("date").notNullable();
    table.integer("late_minutes").defaultTo(0);
    table.integer("overtime_minutes").defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attendances", (table) => {
    table.dropForeign(["shift_code"]);
    table.dropColumn("shift_code");
    table.dropColumn("date");
    table.dropColumn("late_minutes");
    table.dropColumn("overtime_minutes");

    table.string("session_code", 10).notNullable();

    table
      .foreign("session_code")
      .references("session_code")
      .inTable("attendance_sessions")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}
