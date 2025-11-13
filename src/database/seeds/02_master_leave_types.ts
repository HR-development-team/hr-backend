import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_leave_types").insert([
    {
      type_code: "TCI0000001",
      name: "Cuti Bulanan",
      deduction: 10000,
      description: "Cuti Bulanan 4 hari.",
    },
    {
      type_code: "TCI0000002",
      name: "Cuti Sakit",
      deduction: 0,
      description: "Cuti karena sakit (memerlukan surat dokter).",
    },
    {
      type_code: "TCI0000003",
      name: "Cuti Tidak Dibayar",
      deduction: 100000,
      description: "Cuti di luar jatah yang akan memotong gaji.",
    },
  ]);
}
