import Knex from "knex";

export async function seed(knex: Knex.Knex): Promise<void> {
  await knex("employment_statuses").del();
  await knex("employment_statuses").insert([
    { name: "Tetap", status_code: "EPS0000001" },
    { name: "Kontrak", status_code: "EPS0000002" },
    { name: "Training", status_code: "EPS0000003" },
    { name: "Keluar", status_code: "EPS0000004" },
    { name: "Magang", status_code: "EPS0000005" },
  ]);
}
