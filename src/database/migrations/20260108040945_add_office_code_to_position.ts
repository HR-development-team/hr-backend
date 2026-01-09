import type { Knex } from "knex";

const TABLE_NAME = "master_positions";
const COLUMN_NAME = "office_code";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string(COLUMN_NAME, 10).nullable().after("position_code").index();

    // Add Foreign Key Constraint
    table
      .foreign(COLUMN_NAME)
      .references("office_code")
      .inTable("master_offices")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropForeign([COLUMN_NAME]);
    table.dropColumn(COLUMN_NAME);
  });
}
