import type { Knex } from "knex";

const DEPARTMENTS_TABLE = "master_departments";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(DEPARTMENTS_TABLE, (table) => {
    // drop the column first
    table.dropColumn("department_code");
    table.dropColumn("name");
  });

  await knex.schema.alterTable(DEPARTMENTS_TABLE, (table) => {
    table.string("department_code", 10).notNullable().unique().after("id");
    table.string("name", 100).notNullable().after("department_code");
    table.text("description").nullable().after("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  try {
    await knex.schema.alterTable(DEPARTMENTS_TABLE, (table) => {
      table.dropColumn("name");
      table.dropColumn("department_code");
    });

    await knex.schema.alterTable(DEPARTMENTS_TABLE, (table) => {
      table.string("name", 100).notNullable().after("id");
      table.string("department_code", 20).notNullable().after("name");
    });
  } catch (error) {
    console.error(`Error during 'down' migration (20251110061946): ${error}`);
    throw error;
  } finally {
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
  }
}
