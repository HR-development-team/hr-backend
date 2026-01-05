import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("master_banks", (table) => {
    table.increments("id").primary();
    table.string("bank_name", 100).notNullable();
    table.string("bank_code", 10).notNullable().unique();
    table.string("alias", 20).notNullable().unique();
    table.integer("is_active").notNullable().defaultTo(1);
    table.timestamps(true, true);
  });

  await knex.schema.alterTable("bank_accounts", (table) => {
    table
      .foreign("bank_code")
      .references("bank_code")
      .inTable("master_banks")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("bank_accounts", (table) => {
    table.dropForeign("bank_code");
  });

  await knex.schema.dropTable("master_banks");
}
