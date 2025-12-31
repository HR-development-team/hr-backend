import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    "ALTER TABLE attendances MODIFY COLUMN check_in_time DATETIME NULL"
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(
    "ALTER TABLE attendances MODIFY COLUMN check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
}
