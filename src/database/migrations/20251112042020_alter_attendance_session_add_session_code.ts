import type { Knex } from "knex";

const ATTENDANCE_SESSIONS_TABLE = "attendance_sessions";
const USERS_TABLE = "users";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ATTENDANCE_SESSIONS_TABLE, (table) => {
    table.dropForeign(["created_by"]);
    table.dropColumn("created_by");
  });

  await knex.schema.alterTable(ATTENDANCE_SESSIONS_TABLE, (table) => {
    table.string("session_code", 10).notNullable().unique().after("id");
    table
      .string("created_by", 10)
      .references("user_code")
      .inTable(USERS_TABLE)
      .onDelete("restrict")
      .notNullable()
      .after("close_time");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ATTENDANCE_SESSIONS_TABLE, (table) => {
    table.dropForeign(["created_by"]);
    table.dropColumn("created_by");
    table.dropColumn("session_code");
  });

  await knex.schema.alterTable(ATTENDANCE_SESSIONS_TABLE, (table) => {
    table
      .integer("created_by")
      .unsigned()
      .references("id")
      .inTable(USERS_TABLE)
      .onDelete("SET NULL");
  });
}
