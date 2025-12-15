import type { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "Password123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  await knex("users").insert([
    {
      user_code: "USR0000001",
      email: "budi.pratama@company.com",
      password: hashedPassword,
      role_code: "ROL0000001",
    },
    {
      user_code: "USR0000002",
      email: "siti.rahmawati@company.com",
      password: hashedPassword,
      role_code: "ROL0000005",
    },
    {
      user_code: "USR0000003",
      email: "andi.setiawan@company.com",
      password: hashedPassword,
      role_code: "ROL0000005",
    },
    {
      user_code: "USR0000004",
      email: "dewi.kartika@company.com",
      password: hashedPassword,
      role_code: "ROL0000004",
    },
    {
      user_code: "USR0000005",
      email: "rina.kusuma@company.com",
      password: hashedPassword,
      role_code: "ROL0000005", // OfficeStaff
      session_token: null,
      login_date: null,
    },
    {
      user_code: "USR0000006",
      email: "dimas.anggara@company.com",
      password: hashedPassword,
      role_code: "ROL0000005", // OfficeStaff
      session_token: null,
      login_date: null,
    },
    {
      user_code: "USR0000007",
      email: "eko.prasetyo@company.com",
      password: hashedPassword,
      role_code: "ROL0000005", // OfficeStaff
      session_token: null,
      login_date: null,
    },
  ]);
}
