import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("master_shifts", (table) => {
    table.increments("id").primary();
    table.string("shift_code", 10).notNullable().unique();
    table.string("name", 100).notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.boolean("is_overnight").notNullable().defaultTo(false);
    table.integer("late_tolerance_minutes").notNullable().defaultTo(15);
    table.integer("check_in_limit_minutes").notNullable().defaultTo(240);
    table.integer("check_out_limit_minutes").notNullable().defaultTo(120);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("master_shifts");
}
