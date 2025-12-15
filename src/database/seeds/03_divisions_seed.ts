import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_divisions").insert([
    {
      division_code: "DIV0000001",
      department_code: "DPT0000001",
      name: "Software Engineering",
      description: "Dev",
    },
    {
      division_code: "DIV0000002",
      department_code: "DPT0000001",
      name: "IT Infrastructure",
      description: "Infra",
    },
    {
      division_code: "DIV0000003",
      department_code: "DPT0000002",
      name: "Recruitment",
      description: "Hiring",
    },
    {
      division_code: "DIV0000004",
      department_code: "DPT0000002",
      name: "Employee Relations",
      description: "ER",
    },
    {
      division_code: "DIV0000005",
      department_code: "DPT0000003",
      name: "Business Development",
      description: "BD",
    },
    {
      division_code: "DIV0000006",
      department_code: "DPT0000003",
      name: "Account Management",
      description: "AM",
    },
    {
      division_code: "DIV0000007",
      department_code: "DPT0000004",
      name: "Accounting",
      description: "Acc",
    },
    {
      division_code: "DIV0000008",
      department_code: "DPT0000004",
      name: "Budget & Planning",
      description: "Plan",
    },
  ]);
}
