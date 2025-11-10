import type { Knex } from "knex";

const POSITIONS_TABLE = "master_positions";
const DIVISIONS_TABLE = "master_divisions";
const DEPARTMENTS_TABLE = "master_departments";

export async function up(knex: Knex): Promise<void> {
  // drop the column first
  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.dropForeign(["department_id"], "positions_department_id_foreign");
  });
  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.dropColumn("position_code");
    table.dropColumn("department_id");
    table.dropColumn("name");
  });

  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.string("position_code", 10).notNullable().unique().after("id");
    table
      .string("division_code", 10)
      .references("division_code")
      .inTable(DIVISIONS_TABLE)
      .onDelete("RESTRICT")
      .notNullable()
      .after("position_code");
    table.string("name", 100).notNullable().after("division_code");
    table.text("description").nullable().after("base_salary");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.dropForeign(
      ["division_code"],
      "master_positions_division_code_foreign"
    );
  });

  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.dropColumn("position_code");
    table.dropColumn("division_code");
    table.dropColumn("name");
    table.dropColumn("description");
  });

  await knex.schema.alterTable(POSITIONS_TABLE, (table) => {
    table.string("name", 100).notNullable().unique().after("id");
    table.string("position_code", 100);
    table
      .integer("department_id")
      .unsigned()
      .references("id")
      .inTable(DEPARTMENTS_TABLE)
      .onDelete("RESTRICT")
      .notNullable();
  });
}
