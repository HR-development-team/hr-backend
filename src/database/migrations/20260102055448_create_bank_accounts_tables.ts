import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("bank_accounts", (table) => {
    table.increments("id").primary();
    table.string("bank_account_code", 10).notNullable().unique();
    table.string("employee_code", 10).notNullable().unique();
    table.string("bank_code", 10).notNullable();
    table.string("account_name", 100).notNullable();
    table.string("account_number").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table
      .foreign("employee_code")
      .references("employee_code")
      .inTable("master_employees")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("bank_accounts");
}
