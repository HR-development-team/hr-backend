import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    // User untuk Budi Santoso (Backend Developer)
    {
      user_code: "USR0000001",
      email: "budi.santoso@marstech.com",
      role: "employee",
      employee_code: "EMP0000001",
      password: "Password123!", // password
    },
    // User untuk Citra Lestari (Frontend Developer)
    {
      user_code: "USR0000002",
      email: "citra.lestari@marstech.com",
      role: "employee",
      employee_code: "EMP0000002",
      password: "Password123!", // password
    },
    // User untuk Admin Perusahaan (HR Staff) - ADMIN
    {
      user_code: "USR0000003",
      email: "admin@marstech.com",
      role: "admin",
      employee_code: "EMP0000003",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // = password
    },
    // User untuk Dewi Anggraini (UI/UX Designer)
    {
      user_code: "USR0000004",
      email: "dewi.anggraini@marstech.com",
      role: "employee",
      employee_code: "EMP0000004",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Eko Prasetyo (Backend Developer)
    {
      user_code: "USR0000005",
      email: "eko.prasetyo@marstech.com",
      role: "employee",
      employee_code: "EMP0000005",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Fitri Handayani (Frontend Developer)
    {
      user_code: "USR0000006",
      email: "fitri.handayani@marstech.com",
      role: "employee",
      employee_code: "EMP0000006",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Gunawan Wijaya (Mobile Developer)
    {
      user_code: "USR0000007",
      email: "gunawan.wijaya@marstech.com",
      role: "employee",
      employee_code: "EMP0000007",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Hana Sari (Data Analyst)
    {
      user_code: "USR0000008",
      email: "hana.sari@marstech.com",
      role: "employee",
      employee_code: "EMP0000008",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Irfan Maulana (Project Manager)
    {
      user_code: "USR0000009",
      email: "irfan.maulana@marstech.com",
      role: "employee",
      employee_code: "EMP0000009",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Jihan Aulia (QA Engineer)
    {
      user_code: "USR0000010",
      email: "jihan.aulia@marstech.com",
      role: "employee",
      employee_code: "EMP0000010",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Kurniawan Adi (Backend Developer)
    {
      user_code: "USR0000011",
      email: "kurniawan.adi@marstech.com",
      role: "employee",
      employee_code: "EMP0000011",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Lestari Wulandari (HR Staff) - ADMIN
    {
      user_code: "USR0000012",
      email: "lestari.wulandari@marstech.com",
      role: "admin",
      employee_code: "EMP0000012",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Mulyono Siregar (DevOps Engineer)
    {
      user_code: "USR0000013",
      email: "mulyono.siregar@marstech.com",
      role: "employee",
      employee_code: "EMP0000013",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Nadia Putri (Finance Staff)
    {
      user_code: "USR0000014",
      email: "nadia.putri@marstech.com",
      role: "employee",
      employee_code: "EMP0000014",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Oki Pratama (Frontend Developer)
    {
      user_code: "USR0000015",
      email: "oki.pratama@marstech.com",
      role: "employee",
      employee_code: "EMP0000015",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Putri Maharani (UI/UX Designer)
    {
      user_code: "USR0000016",
      email: "putri.maharani@marstech.com",
      role: "employee",
      employee_code: "EMP0000016",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Rizki Ramadhan (Mobile Developer)
    {
      user_code: "USR0000017",
      email: "rizki.ramadhan@marstech.com",
      role: "employee",
      employee_code: "EMP0000017",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Sari Indah (Data Analyst)
    {
      user_code: "USR0000018",
      email: "sari.indah@marstech.com",
      role: "employee",
      employee_code: "EMP0000018",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Teguh Santoso (Project Manager)
    {
      user_code: "USR0000019",
      email: "teguh.santoso@marstech.com",
      role: "employee",
      employee_code: "EMP0000019",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    // User untuk Umi Kulsum (QA Engineer)
    {
      user_code: "USR0000020",
      email: "umi.kulsum@marstech.com",
      role: "employee",
      employee_code: "EMP0000020",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
  ]);
}
