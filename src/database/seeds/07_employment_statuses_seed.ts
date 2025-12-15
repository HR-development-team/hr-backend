import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("employment_statuses").insert([
    { status_code: "EPS0000001", name: "Tetap" },
    { status_code: "EPS0000002", name: "Kontrak" },
    { status_code: "EPS0000003", name: "Training" },
    { status_code: "EPS0000004", name: "Keluar" },
    { status_code: "EPS0000005", name: "Magang" },
  ]);
}
