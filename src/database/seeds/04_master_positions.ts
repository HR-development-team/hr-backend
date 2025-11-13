import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_positions").insert([
    {
      position_code: "POS0000001",
      division_code: "DVS0000001", // Division Technology - Backend
      name: "Backend Developer",
      base_salary: 12000000,
      description:
        "Developer yang bertugas dalam pengembangan logika bisnis aplikasi dan server-side programming",
    },
    {
      position_code: "POS0000002",
      division_code: "DVS0000001", // Division Technology - Frontend
      name: "Frontend Developer",
      base_salary: 11000000,
      description:
        "Developer yang bertugas dalam pengembangan antarmuka pengguna dan client-side programming",
    },
    {
      position_code: "POS0000003",
      division_code: "DVS0000002", // Division Human Resources
      name: "HR Staff",
      base_salary: 7500000,
      description: "Staf yang bertugas mengurus administrasi HR dan payroll",
    },
    {
      position_code: "POS0000004",
      division_code: "DVS0000001", // Division Technology - Design
      name: "UI/UX Designer",
      base_salary: 9500000,
      description:
        "Designer yang bertugas mendesain antarmuka pengguna dan pengalaman pengguna",
    },
    {
      position_code: "POS0000005",
      division_code: "DVS0000001", // Division Technology - Mobile
      name: "Mobile Developer",
      base_salary: 11500000,
      description:
        "Developer yang bertugas dalam pengembangan aplikasi mobile untuk iOS dan Android",
    },
    {
      position_code: "POS0000006",
      division_code: "DVS0000003", // Division Data & Analytics
      name: "Data Analyst",
      base_salary: 10000000,
      description:
        "Analyst yang bertugas menganalisis data bisnis dan memberikan insights",
    },
    {
      position_code: "POS0000007",
      division_code: "DVS0000004", // Division Project Management
      name: "Project Manager",
      base_salary: 15000000,
      description:
        "Manager yang bertugas mengelola proyek pengembangan software dari awal hingga selesai",
    },
    {
      position_code: "POS0000008",
      division_code: "DVS0000001", // Division Technology - QA
      name: "QA Engineer",
      base_salary: 8500000,
      description:
        "Engineer yang bertugas melakukan testing dan quality assurance pada produk software",
    },
    {
      position_code: "POS0000009",
      division_code: "DVS0000001", // Division Technology - DevOps
      name: "DevOps Engineer",
      base_salary: 13000000,
      description:
        "Engineer yang bertugas mengelola infrastructure, deployment, dan CI/CD pipeline",
    },
    {
      position_code: "POS0000010",
      division_code: "DVS0000005", // Division Finance
      name: "Finance Staff",
      base_salary: 7000000,
      description:
        "Staf yang bertugas mengelola keuangan perusahaan dan administrasi finansial",
    },
    {
      position_code: "POS0000011",
      division_code: "DVS0000001", // Division Technology - Lead
      name: "Tech Lead",
      base_salary: 18000000,
      description:
        "Lead developer yang bertugas memimpin tim teknis dan membuat keputusan arsitektur",
    },
    {
      position_code: "POS0000012",
      division_code: "DVS0000002", // Division Human Resources - Manager
      name: "HR Manager",
      base_salary: 12000000,
      description:
        "Manager yang bertugas mengelola seluruh operasional divisi human resources",
    },
    {
      position_code: "POS0000013",
      division_code: "DVS0000003", // Division Data & Analytics - Lead
      name: "Data Scientist",
      base_salary: 14000000,
      description:
        "Scientist yang bertugas mengembangkan model machine learning dan analisis data kompleks",
    },
    {
      position_code: "POS0000014",
      division_code: "DVS0000001", // Division Technology - Security
      name: "Security Engineer",
      base_salary: 12500000,
      description:
        "Engineer yang bertugas menjaga keamanan sistem dan aplikasi dari ancaman cyber",
    },
    {
      position_code: "POS0000015",
      division_code: "DVS0000006", // Division Marketing
      name: "Digital Marketing",
      base_salary: 8000000,
      description:
        "Staf yang bertugas menjalankan strategi pemasaran digital dan kampanye online",
    },
  ]);
}
