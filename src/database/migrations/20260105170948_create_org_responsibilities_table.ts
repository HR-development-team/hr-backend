import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("org_responsibilities", (table) => {
    table.increments("id").primary();
    table
      .enum("scope_type", ["office", "department", "division"])
      .notNullable();
    table.string("scope_code", 10).notNullable();
    table.string("employee_code", 10).notNullable();
    table.string("role", 50).notNullable().defaultTo("Head");
    table.date("start_date").notNullable();
    table.date("end_date").nullable();

    table.boolean("is_active").defaultTo(true);

    table.timestamps(true, true);

    table.index(
      ["scope_type", "scope_code", "is_active"],
      "idx_org_active_leader"
    );

    table.index(["employee_code"]);

    table
      .foreign("employee_code")
      .references("employee_code")
      .inTable("master_employees")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("org_responsibilities");
}
