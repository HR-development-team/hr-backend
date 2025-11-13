import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_divisions").insert([
    {
      division_code: "DVS0000001",
      department_code: "DPT0000001", // Teknologi
      name: "Backend Engineering",
      description: "Divisi pengembangan backend dan server-side applications",
    },
    {
      division_code: "DVS0000002",
      department_code: "DPT0000001", // Teknologi
      name: "Frontend Engineering",
      description: "Divisi pengembangan frontend dan user interface",
    },
    {
      division_code: "DVS0000003",
      department_code: "DPT0000001", // Teknologi
      name: "Mobile & DevOps",
      description: "Divisi pengembangan mobile aplikasi dan infrastructure",
    },
    {
      division_code: "DVS0000004",
      department_code: "DPT0000001", // Teknologi
      name: "Quality Assurance",
      description: "Divisi testing dan quality control software",
    },
    {
      division_code: "DVS0000005",
      department_code: "DPT0000002", // HR
      name: "HR & Payroll",
      description: "Divisi human resources dan penggajian",
    },
    {
      division_code: "DVS0000006",
      department_code: "DPT0000003", // Keuangan
      name: "Finance & Accounting",
      description: "Divisi keuangan dan akuntansi perusahaan",
    },
    {
      division_code: "DVS0000007",
      department_code: "DPT0000001", // Teknologi
      name: "Project Management",
      description: "Divisi manajemen proyek teknologi",
    },
    {
      division_code: "DVS0000008",
      department_code: "DPT0000001", // Teknologi
      name: "Data & Analytics",
      description: "Divisi analisis data dan business intelligence",
    },
  ]);
}
