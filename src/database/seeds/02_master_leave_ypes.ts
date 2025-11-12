import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_leave_types").insert([
    {
      name: "Cuti Tahunan",
      deduction: 0,
      description: "Cuti tahunan yang menjadi hak karyawan.",
    },
    {
      name: "Cuti Sakit",
      deduction: 0,
      description: "Cuti karena sakit (memerlukan surat dokter).",
    },
    {
      name: "Cuti Tidak Dibayar",
      deduction: 100000, // Contoh pemotongan per hari
      description: "Cuti di luar jatah yang akan memotong gaji.",
    },
  ]);
}
