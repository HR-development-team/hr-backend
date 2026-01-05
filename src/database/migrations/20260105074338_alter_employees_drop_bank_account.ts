import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_employees", (table) => {
    table.dropColumn("bank_account");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_employees", (table) => {
    table.string("bank_account", 50).nullable();
  });
}
