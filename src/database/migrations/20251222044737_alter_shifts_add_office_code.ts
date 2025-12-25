import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_shifts", (table) => {
    table.string("office_code", 10).notNullable();
    table.json("work_days").notNullable();

    table
      .foreign("office_code")
      .references("office_code")
      .inTable("master_offices")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_shifts", (table) => {
    table.dropForeign(["office_code"]);
    table.dropColumn("office_code");
    table.dropColumn("work_days");
  });
}
