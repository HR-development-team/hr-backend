import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Create employment_statuses table
  await knex.schema.createTable("employment_statuses", (table) => {
    table.increments("id").primary();
    table.string("status_code", 10).notNullable().unique();
    table.string("name", 100).notNullable();
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 2. Insert default statuses
  await knex("employment_statuses").insert([
    { status_code: "tetap", name: "Tetap" },
    { status_code: "kontrak", name: "Kontrak" },
    { status_code: "training", name: "Training" },
    { status_code: "keluar", name: "Keluar" },
    { status_code: "magang", name: "Magang" },
  ]);

  // 3. Add new FK column to master_employees
  await knex.schema.alterTable("master_employees", (table) => {
    table
      .integer("employment_status_id")
      .unsigned()
      .references("id")
      .inTable("employment_statuses")
      .nullable();
  });

  // 4. Migrate existing data from employment_status → employment_status_id
  const statusMap: Record<string, string> = {
    aktif: "tetap",
    kontrak: "kontrak",
    training: "training",
    keluar: "keluar",
    magang: "magang",
  };

  const employees = await knex("master_employees");

  for (const emp of employees) {
    const oldStatus = emp.employment_status?.toLowerCase();
    const code = statusMap[oldStatus] ?? "tetap"; // default

    const statusRecord = await knex("employment_statuses")
      .where("status_code", code)
      .first();

    if (statusRecord) {
      await knex("master_employees")
        .where("id", emp.id)
        .update({ employment_status_id: statusRecord.id });
    }
  }

  // 5. Drop old varchar column
  await knex.schema.alterTable("master_employees", (table) => {
    table.dropColumn("employment_status");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Add old column back
  await knex.schema.alterTable("master_employees", (table) => {
    table.string("employment_status", 50).defaultTo("aktif");
  });

  // Restore data (simple rollback)
  const statuses = await knex("employment_statuses");

  for (const emp of await knex("master_employees")) {
    const status = statuses.find((s) => s.id === emp.employment_status_id);
    await knex("master_employees")
      .where("id", emp.id)
      .update({ employment_status: status?.status_code ?? "aktif" });
  }

  // Remove FK column
  await knex.schema.alterTable("master_employees", (table) => {
    table.dropColumn("employment_status_id");
  });

  // Remove reference table
  await knex.schema.dropTable("employment_statuses");
}
