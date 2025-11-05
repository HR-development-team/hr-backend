import type { Knex } from "knex";

const LEAVE_TYPES_TABLE = "master_leave_types";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(LEAVE_TYPES_TABLE, (table) => {
    table.decimal("deduction", 12, 2).notNullable().defaultTo(0).after("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(LEAVE_TYPES_TABLE, (table) => {
    table.dropColumn("deduction");
  });
}
