import type { Knex } from "knex";

const EMPLOYEES_TABLE = "master_employees";
const POSITION_TABLE = "master_positions";

export async function up(knex: Knex): Promise<void> {
  // drop the column first
  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.dropForeign(["position_id"], "employees_position_id_foreign");
  });
  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.dropColumn("first_name");
    table.dropColumn("last_name");
    table.dropColumn("position_id");
    table.dropColumn("address");
    table.dropColumn("contact_phone");
    table.dropColumn("join_date");
  });

  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.string("employee_code", 10).notNullable().unique().after("id");
    table
      .string("position_code", 10)
      .references("position_code")
      .inTable(POSITION_TABLE)
      .onDelete("RESTRICT")
      .notNullable()
      .after("employee_code");
    table.string("full_name", 100).notNullable().after("position_code");
    table.string("ktp_number", 16).nullable().unique().after("full_name");
    table.string("birth_place", 100).nullable().after("ktp_number");
    table.date("birth_date").nullable().after("birth_place");
    table
      .enum("gender", ["laki-laki", "perempuan"])
      .nullable()
      .after("birth_date");
    table.text("address").after("gender");
    table.string("contact_phone", 20).after("address");
    table.string("religion", 50).nullable().after("contact_phone");
    table.string("maritial_status", 50).nullable().after("religion");
    table.date("join_date").notNullable().after("maritial_status");
    table.string("resign_date", 50).nullable().after("join_date");
    table.string("employment_status", 50).nullable().after("resign_date");
    table.string("education", 50).nullable().after("employment_status");
    table.string("blood_type", 5).nullable().after("education");
    table.string("profile_picture", 255).nullable().after("blood_type");
    table
      .string("bpjs_ketenagakerjaan", 50)
      .nullable()
      .unique()
      .after("profile_picture");
    table
      .string("bpjs_kesehatan", 50)
      .nullable()
      .unique()
      .after("bpjs_ketenagakerjaan");
    table.string("npwp", 50).nullable().unique().after("bpjs_kesehatan");
    table.string("bank_account", 50).nullable().after("npwp");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    // Remove new fields
    table.dropColumn("bank_account");
    table.dropColumn("npwp");
    table.dropColumn("bpjs_kesehatan");
    table.dropColumn("bpjs_ketenagakerjaan");
    table.dropColumn("profile_picture");
    table.dropColumn("blood_type");
    table.dropColumn("education");
    table.dropColumn("employment_status");
    table.dropColumn("resign_date");
    table.dropColumn("maritial_status");
    table.dropColumn("religion");
    table.dropColumn("address");
    table.dropColumn("gender");
    table.dropColumn("birth_date");
    table.dropColumn("birth_place");
    table.dropColumn("ktp_number");
    table.dropColumn("full_name");
    table.dropForeign(["position_code"]);
    table.dropColumn("position_code");
    table.dropColumn("employee_code");
  });

  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();

    table
      .integer("position_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(POSITION_TABLE)
      .onDelete("RESTRICT");
  });
}
