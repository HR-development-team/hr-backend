import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama (Opsional)
  // await knex("master_positions").del();

  await knex("master_positions")
    .insert([
      // ==========================================
      // LEADERS (Level 1)
      // ==========================================
      {
        position_code: "JBT0000002",
        division_code: "DIV0101001", // Software Engineering
        name: "Senior Software Engineer",
        base_salary: 12000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead Developer",
      },
      {
        position_code: "JBT0000005",
        division_code: "DIV0101002", // IT Infrastructure
        name: "Network Administrator",
        base_salary: 9000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Network Lead",
      },
      {
        position_code: "JBT0000009",
        division_code: "DIV0102002", // Employee Relations (Head of HR Ops)
        name: "HR Manager",
        base_salary: 13000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Manager HR",
      },
      {
        position_code: "JBT0000011",
        division_code: "DIV0104002", // Strategic Planning (BizDev context)
        name: "Business Dev Manager",
        base_salary: 14000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Manager BD",
      },
      {
        position_code: "JBT0000013",
        division_code: "DIV0104002", // Strategic Planning
        name: "Senior Account Manager",
        base_salary: 11000000,
        parent_position_code: null,
        sort_order: 2, // Urutan ke-2 di divisi yang sama
        description: "Senior AM",
      },
      {
        position_code: "JBT0000015",
        division_code: "DIV0103001", // Accounting
        name: "Senior Accountant",
        base_salary: 12000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Senior Acc",
      },

      // ==========================================
      // STAFF (Level 2 - Punya Parent)
      // ==========================================

      // --- Tim Software Engineering (DIV0101001) ---
      {
        position_code: "JBT0000001",
        division_code: "DIV0101001",
        name: "Software Engineer",
        base_salary: 8000000,
        parent_position_code: "JBT0000002", // Reports to Senior SE
        sort_order: 2,
        description: "Backend/Frontend",
      },
      {
        position_code: "JBT0000003",
        division_code: "DIV0101001",
        name: "QA Engineer",
        base_salary: 7000000,
        parent_position_code: "JBT0000002", // Reports to Senior SE
        sort_order: 3,
        description: "Tester",
      },

      // --- Tim IT Infrastructure (DIV0101002) ---
      {
        position_code: "JBT0000004",
        division_code: "DIV0101002",
        name: "IT Support Specialist",
        base_salary: 6000000,
        parent_position_code: "JBT0000005", // Reports to Net Admin
        sort_order: 2,
        description: "Helpdesk Support",
      },

      // --- Tim HR Recruitment (DIV0102001) ---
      // Parentnya HR Manager (beda divisi tidak masalah secara logika bisnis)
      {
        position_code: "JBT0000006",
        division_code: "DIV0102001", // Recruitment
        name: "Recruitment Officer",
        base_salary: 6500000,
        parent_position_code: "JBT0000009", // Reports to HR Manager
        sort_order: 1,
        description: "Recruiter",
      },
      {
        position_code: "JBT0000007",
        division_code: "DIV0102001", // Recruitment
        name: "Talent Acquisition Spc",
        base_salary: 8500000,
        parent_position_code: "JBT0000009", // Reports to HR Manager
        sort_order: 2,
        description: "Headhunter",
      },

      // --- Tim HR Relations (DIV0102002) ---
      {
        position_code: "JBT0000008",
        division_code: "DIV0102002", // Employee Relations
        name: "HR Officer",
        base_salary: 7000000,
        parent_position_code: "JBT0000009", // Reports to HR Manager
        sort_order: 2,
        description: "General HR",
      },

      // --- Tim Strategic Planning / BizDev (DIV0104002) ---
      {
        position_code: "JBT0000010",
        division_code: "DIV0104002",
        name: "BizDev Officer",
        base_salary: 7500000,
        parent_position_code: "JBT0000011", // Reports to BizDev Manager
        sort_order: 3,
        description: "Partnership Staff",
      },
      {
        position_code: "JBT0000012",
        division_code: "DIV0104002",
        name: "Account Executive",
        base_salary: 7000000,
        parent_position_code: "JBT0000013", // Reports to Senior AM
        sort_order: 4,
        description: "Junior Sales/AE",
      },

      // --- Tim Finance & Accounting ---
      {
        position_code: "JBT0000014",
        division_code: "DIV0103001", // Accounting
        name: "Accountant",
        base_salary: 8000000,
        parent_position_code: "JBT0000015", // Reports to Senior Acc
        sort_order: 2,
        description: "Staff Accounting",
      },
      {
        position_code: "JBT0000016",
        division_code: "DIV0103003", // Budgeting
        name: "Financial Analyst",
        base_salary: 9000000,
        parent_position_code: "JBT0000015", // Reports to Senior Acc (Cross-div reporting)
        sort_order: 1,
        description: "Analyst",
      },
      {
        position_code: "JBT0000017",
        division_code: "DIV0103003", // Budgeting
        name: "Budget Officer",
        base_salary: 9500000,
        parent_position_code: "JBT0000015", // Reports to Senior Acc
        sort_order: 2,
        description: "Budget Control",
      },
    ])
    .onConflict("position_code") // Update berdasarkan kode jabatan
    .merge();
}
