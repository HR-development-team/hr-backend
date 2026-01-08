import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_offices", (table) => {
    table.string("leader_position_code", 10).nullable();

    table
      .foreign("leader_position_code")
      .references("position_code")
      .inTable("master_positions")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("master_departments", (table) => {
    table.string("leader_position_code", 10).nullable();

    table
      .foreign("leader_position_code")
      .references("position_code")
      .inTable("master_positions")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });

  await knex.schema.alterTable("master_divisions", (table) => {
    table.string("leader_position_code", 10).nullable();

    table
      .foreign("leader_position_code")
      .references("position_code")
      .inTable("master_positions")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_offices", (table) => {
    table.dropForeign("leader_position_code");
    table.dropColumn("leader_position_code");
  });

  await knex.schema.alterTable("master_departments", (table) => {
    table.dropForeign("leader_position_code");
    table.dropColumn("leader_position_code");
  });

  await knex.schema.alterTable("master_divisions", (table) => {
    table.dropForeign("leader_position_code");
    table.dropColumn("leader_position_code");
  });
}
