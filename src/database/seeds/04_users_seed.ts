import type { Knex } from "knex";

const TABLE_NAME = "users";

export async function seed(knex: Knex): Promise<void> {
  // 1. Hapus data user lama
  await knex(TABLE_NAME).del();

  // Password: "password"
  const PASSWORD_HASH =
    "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

  await knex(TABLE_NAME).insert([
    {
      // Admin (USR0000001 -> Pas 10 Karakter)
      user_code: "USR0000001",
      email: "admin@marstech.com",
      password: PASSWORD_HASH,
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      // Karyawan (USR0000002 -> Pas 10 Karakter)
      user_code: "USR0000002",
      email: "karyawan@marstech.com",
      password: PASSWORD_HASH,
      role: "employee",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
