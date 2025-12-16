import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Opsional: Bersihkan data lama
  // await knex("master_divisions").del();

  await knex("master_divisions")
    .insert([
      // =======================================================
      // DEPARTEMEN: TECHNOLOGY (DPT0100001)
      // =======================================================
      {
        division_code: "DIV0000001",
        department_code: "DPT0100001", // Technology
        name: "Software Engineering",
        description: "Dev",
      },
      {
        division_code: "DIV0000002",
        department_code: "DPT0100001", // Technology
        name: "IT Infrastructure",
        description: "Infra",
      },

      // =======================================================
      // DEPARTEMEN: HUMAN RESOURCES (DPT0100002)
      // =======================================================
      {
        division_code: "DIV0000003",
        department_code: "DPT0100002", // HR
        name: "Recruitment",
        description: "Hiring",
      },
      {
        division_code: "DIV0000004",
        department_code: "DPT0100002", // HR
        name: "Employee Relations",
        description: "ER",
      },

      // =======================================================
      // DEPARTEMEN: EXECUTIVE MANAGEMENT (DPT0100004)
      // Note: Saya pindahkan BizDev ke sini karena lebih cocok
      // daripada masuk ke Finance.
      // =======================================================
      {
        division_code: "DIV0000005",
        department_code: "DPT0100004", // Executive Management
        name: "Business Development",
        description: "BD",
      },
      {
        division_code: "DIV0000006",
        department_code: "DPT0100004", // Executive Management
        name: "Account Management",
        description: "AM",
      },

      // =======================================================
      // DEPARTEMEN: FINANCE & ACCOUNTING (DPT0100003)
      // Note: Saya pindahkan Accounting ke sini (DPT...03)
      // agar sesuai dengan nama departemennya.
      // =======================================================
      {
        division_code: "DIV0000007",
        department_code: "DPT0100003", // Finance & Accounting
        name: "Accounting",
        description: "Acc",
      },
      {
        division_code: "DIV0000008",
        department_code: "DPT0100003", // Finance & Accounting
        name: "Budget & Planning",
        description: "Plan",
      },
    ])
    .onConflict("division_code")
    .merge();
}
