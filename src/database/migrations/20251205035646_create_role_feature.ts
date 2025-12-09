import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create the 'roles' table
  await knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.string("role_code", 10).notNullable().unique();
    table.string("name", 50).notNullable().unique();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Modify the existing 'users' table to use 'role_code'
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("role");
    table.string("role_code", 10).notNullable();
    table
      .foreign("role_code")
      .references("role_code")
      .inTable("roles")
      .onUpdate("CASCADE")
      .onDelete("RESTRICT");
    table.text("session_token");
    table.timestamp("login_date");
  });

  // Create the 'features' table (what the role can access)
  await knex.schema.createTable("features", (table) => {
    table.increments("id").primary();
    table.string("feature_code", 10).notNullable().unique();
    table.string("name", 50).notNullable().unique();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Create the 'role_permissions' table (the many-to-many relationship with permissions)
  await knex.schema.createTable("role_permissions", (table) => {
    table.string("role_code", 10).notNullable();
    table.string("feature_code", 10).notNullable();
    table.primary(["role_code", "feature_code"]);
    table.boolean("can_create").notNullable().defaultTo(false);
    table.boolean("can_read").notNullable().defaultTo(false);
    table.boolean("can_update").notNullable().defaultTo(false);
    table.boolean("can_delete").notNullable().defaultTo(false);
    table.boolean("can_print").notNullable().defaultTo(false);
    table
      .foreign("role_code")
      .references("role_code")
      .inTable("roles")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("feature_code")
      .references("feature_code")
      .inTable("features")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("role_permissions");
  await knex.schema.dropTableIfExists("features");

  await knex.schema.alterTable("users", (table) => {
    table.dropForeign("role_code");
    table.dropColumn("role_code");
    table.dropColumn("session_token");
    table.dropColumn("login_date");
    table
      .enum("role", ["admin", "employee"])
      .notNullable()
      .defaultTo("employee");
  });

  await knex.schema.dropTableIfExists("roles");
}
