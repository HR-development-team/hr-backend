import type { Knex } from "knex";

const EMPLOYEE_PHOTOS_TABLE = "employee_photos";
const EMPLOYEES_TABLE = "master_employees";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(EMPLOYEE_PHOTOS_TABLE, (table) => {
    table.increments("id").primary();
    table
      .string("employee_code", 10)
      .notNullable()
      .unique()
      .references("employee_code")
      .inTable(EMPLOYEES_TABLE)
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.specificType("photo", "LONGBLOB").notNullable();
    table.string("mimetype", 50).notNullable();
    table.integer("file_size").nullable();
    table.timestamp("uploaded_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  try {
    await knex.schema.dropTableIfExists(EMPLOYEE_PHOTOS_TABLE);
  } catch (error) {
    console.error(`Error during 'down' migration: ${error}`);
    throw error;
  } finally {
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
  }
}