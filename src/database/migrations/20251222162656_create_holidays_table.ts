import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("holidays", (table) => {
    table.increments("id").primary();
    table.string("office_code", 10).nullable().index();
    // table.string("department_code", 10).nullable().index;
    table.date("date").notNullable();
    table.string("description").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table
      .foreign("office_code")
      .references("office_code")
      .inTable("master_offices")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // table
    //   .foreign("department_code")
    //   .references("department_code")
    //   .inTable("master_departments")
    //   .onUpdate("CASCADE")
    //   .onDelete("CASCADE");

    table.unique(["date", "office_code"], "unique_holidays_scope");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("holidays");
}
