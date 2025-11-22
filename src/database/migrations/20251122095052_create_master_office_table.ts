import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("master_offices", (table) => {
    table.increments("id").primary();
    table.string("office_code", 10).notNullable().unique();
    table.string("name", 100).notNullable();
    table.text("address").notNullable();

    table.decimal("latitude", 10, 8).notNullable();
    table.decimal("longitude", 11, 8).notNullable();
    table.integer("radius_meters").unsigned().notNullable().defaultTo(50);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("master_offices");
}
