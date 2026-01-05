import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const banks = [
    // --- Bank BUMN (Himbara) ---
    {
      bank_code: "002",
      bank_name: "PT Bank Rakyat Indonesia (Persero) Tbk",
      alias: "BRI",
      is_active: 1,
    },
    {
      bank_code: "008",
      bank_name: "PT Bank Mandiri (Persero) Tbk",
      alias: "Mandiri",
      is_active: 1,
    },
    {
      bank_code: "009",
      bank_name: "PT Bank Negara Indonesia (Persero) Tbk",
      alias: "BNI",
      is_active: 1,
    },
    {
      bank_code: "200",
      bank_name: "PT Bank Tabungan Negara (Persero) Tbk",
      alias: "BTN",
      is_active: 1,
    },
    {
      bank_code: "451",
      bank_name: "PT Bank Syariah Indonesia Tbk",
      alias: "BSI",
      is_active: 1,
    },

    // --- Bank Swasta Besar ---
    {
      bank_code: "014",
      bank_name: "PT Bank Central Asia Tbk",
      alias: "BCA",
      is_active: 1,
    },
    {
      bank_code: "022",
      bank_name: "PT Bank CIMB Niaga Tbk",
      alias: "CIMB Niaga",
      is_active: 1,
    },
    {
      bank_code: "013",
      bank_name: "PT Bank Permata Tbk",
      alias: "Permata",
      is_active: 1,
    },
    {
      bank_code: "011",
      bank_name: "PT Bank Danamon Indonesia Tbk",
      alias: "Danamon",
      is_active: 1,
    },
    {
      bank_code: "016",
      bank_name: "PT Bank Maybank Indonesia Tbk",
      alias: "Maybank",
      is_active: 1,
    },
    {
      bank_code: "019",
      bank_name: "PT Bank Panin Tbk",
      alias: "Panin",
      is_active: 1,
    },
    {
      bank_code: "028",
      bank_name: "PT Bank OCBC NISP Tbk",
      alias: "OCBC NISP",
      is_active: 1,
    },

    // --- Bank Digital (Populer) ---
    {
      bank_code: "542",
      bank_name: "PT Bank Jago Tbk",
      alias: "Jago",
      is_active: 1,
    },
    {
      bank_code: "213",
      bank_name: "PT Bank BTPN Tbk (Jenius)",
      alias: "Jenius/BTPN",
      is_active: 1,
    },
    {
      bank_code: "535",
      bank_name: "PT Bank Seabank Indonesia",
      alias: "SeaBank",
      is_active: 1,
    },
    {
      bank_code: "490",
      bank_name: "PT Bank Neo Commerce Tbk",
      alias: "Neo Commerce",
      is_active: 1,
    },
    {
      bank_code: "567",
      bank_name: "PT Allo Bank Indonesia Tbk",
      alias: "Allo Bank",
      is_active: 1,
    },

    // --- Bank Daerah (Contoh) ---
    {
      bank_code: "111",
      bank_name: "PD BPD DKI Jakarta",
      alias: "Bank DKI",
      is_active: 1,
    },
    {
      bank_code: "110",
      bank_name: "PD BPD Jawa Barat dan Banten",
      alias: "BJB",
      is_active: 1,
    },
  ];

  await knex("master_banks").insert(banks).onConflict("bank_code").merge();
}
