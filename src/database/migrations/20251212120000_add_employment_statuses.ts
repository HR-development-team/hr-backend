import type { Knex } from "knex";

const TABLE_STATUS = "employment_statuses";
const TABLE_EMPLOYEE = "master_employees";

// KITA SEPAKATI NAMANYA: 'employment_status_code'
// (Biar konsisten dengan style 'office_code', 'position_code')
const FK_COLUMN = "employment_status_code";
const OLD_COLUMN = "employment_status";

export async function up(knex: Knex): Promise<void> {
  // 1. Create Tabel employment_statuses
  const hasTable = await knex.schema.hasTable(TABLE_STATUS);
  if (!hasTable) {
    await knex.schema.createTable(TABLE_STATUS, (table) => {
      table.increments("id").primary();
      // Pastikan panjangnya cukup (20)
      table.string("status_code", 20).notNullable().unique();
      table.string("name", 100).notNullable();
      table.text("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }

  // 3. Buat Kolom FK Baru (String) di Tabel Employee
  const hasFkCol = await knex.schema.hasColumn(TABLE_EMPLOYEE, FK_COLUMN);
  if (!hasFkCol) {
    await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
      table
        .string(FK_COLUMN, 20)
        .references("status_code") // Nembak ke status_code (String)
        .inTable(TABLE_STATUS)
        .nullable()
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
    });
  }

  // 4. Migrasi Data Lama (String -> String Code FK)
  const hasOldCol = await knex.schema.hasColumn(TABLE_EMPLOYEE, OLD_COLUMN);

  // Pastikan kolom BARU (FK) sudah benar-benar ada sebelum kita update isinya
  // Cek ulang hasColumn untuk safety
  const fkExistsNow = await knex.schema.hasColumn(TABLE_EMPLOYEE, FK_COLUMN);

  if (hasOldCol && fkExistsNow) {
    const statusMap: Record<string, string> = {
      aktif: "tetap",
      tetap: "tetap",
      kontrak: "kontrak",
      training: "training",
      keluar: "keluar",
      magang: "magang",
    };

    const employees = await knex(TABLE_EMPLOYEE).select("id", OLD_COLUMN);

    for (const emp of employees) {
      if (emp[OLD_COLUMN]) {
        const oldStatus = emp[OLD_COLUMN].toLowerCase();
        const newCode = statusMap[oldStatus] ?? "tetap";

        // Validasi: Code harus ada di master
        const statusRecord = await knex(TABLE_STATUS)
          .where("status_code", newCode)
          .first();

        if (statusRecord) {
          await knex(TABLE_EMPLOYEE)
            .where("id", emp.id)
            .update({ [FK_COLUMN]: statusRecord.status_code });
        }
      }
    }

    // 5. Hapus Kolom Lama
    await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
      table.dropColumn(OLD_COLUMN);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // 1. KEMBALIKAN KOLOM LAMA (Safety Check)
  // Cek dulu, kalau belum ada baru dibuat.
  const hasOldCol = await knex.schema.hasColumn(TABLE_EMPLOYEE, OLD_COLUMN);
  if (!hasOldCol) {
    await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
      table.string(OLD_COLUMN, 50).defaultTo("aktif");
    });
  }

  // 2. COBA HAPUS CONSTRAINT (FK) - SATU PER SATU
  // Gunakan try-catch di LEVEL LUAR (pada await) agar script tidak mati

  // A. Coba hapus constraint versi CODE (yang error barusan)
  try {
    await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
      table.dropForeign([], "master_employees_employment_status_code_foreign");
    });
    console.log("FK Code berhasil dihapus atau sudah tidak ada.");
  } catch (e) {
    console.log("FK Code tidak ditemukan, skip.");
  }

  // B. Coba hapus constraint versi ID (sisa percobaan lama, jaga-jaga)
  try {
    await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
      table.dropForeign([], "master_employees_employment_status_id_foreign");
    });
    console.log("FK ID berhasil dihapus atau sudah tidak ada.");
  } catch (e) {
    console.log("FK ID tidak ditemukan, skip.");
  }

  // 3. HAPUS KOLOM FK (Bersihkan sisa-sisa)

  // A. Coba hapus kolom CODE (Cek dulu biar gak error column not found)
  if (await knex.schema.hasColumn(TABLE_EMPLOYEE, "employment_status_code")) {
    try {
      await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
        table.dropColumn("employment_status_code");
      });
    } catch (e) {
      /* Ignore */
    }
  }

  // B. Coba hapus kolom ID (jaga-jaga kalau ada sisa)
  if (await knex.schema.hasColumn(TABLE_EMPLOYEE, "employment_status_id")) {
    try {
      await knex.schema.alterTable(TABLE_EMPLOYEE, (table) => {
        table.dropColumn("employment_status_id");
      });
    } catch (e) {
      /* Ignore */
    }
  }

  // 4. BARU HAPUS TABEL INDUK
  // Sekarang dijamin aman karena semua tali pengikat sudah dipotong paksa di atas
  await knex.schema.dropTableIfExists(TABLE_STATUS);
}
