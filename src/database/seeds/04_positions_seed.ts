import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama
  await knex("master_positions").del();

  const positions = [
    // =======================================================
    // 0. TOP LEADERSHIP (01 - 02)
    // =======================================================
    {
      position_code: "JBT0000001", // CEO
      office_code: "OFC0000001",
      division_code: null,
      name: "Chief Executive Officer",
      base_salary: 35000000,
      parent_position_code: null,
      sort_order: 0,
      description: "Pimpinan Tertinggi Perusahaan",
    },
    {
      position_code: "JBT0000002", // Branch Manager Surabaya
      office_code: "OFC0000002",
      division_code: null,
      name: "Branch Manager Surabaya",
      base_salary: 20000000,
      parent_position_code: "JBT0000001", // Reports to CEO (01)
      sort_order: 0,
      description: "Kepala Cabang Jatim",
    },

    // =======================================================
    // 1. KANTOR PUSAT (Starts from 03)
    // =======================================================
    // -------------------------------------------------------
    // DEPT 1: Technology & Infrastructure (DPT0100001)
    // -------------------------------------------------------
    {
      position_code: "JBT0000003",
      office_code: "OFC0000001",
      department_code: "DPT0100001",
      division_code: null,
      name: "Head of Technology",
      base_salary: 18000000,
      parent_position_code: "JBT0000001", // Reports to CEO
      sort_order: 1,
      description: "Kepala Departemen Teknologi",
    },
    // ---> DIV 1: Software Engineering (DIV0101001)
    {
      position_code: "JBT0000004",
      office_code: "OFC0000001",
      department_code: "DPT0100001",
      division_code: "DIV0101001",
      name: "Software Engineering Manager",
      base_salary: 12000000,
      parent_position_code: "JBT0000003", // Reports to Head of Tech
      sort_order: 2,
      description: "Kepala Divisi Software",
    },
    {
      position_code: "JBT0000005",
      office_code: "OFC0000001",
      department_code: "DPT0100001",
      division_code: "DIV0101001",
      name: "Senior Backend Engineer",
      base_salary: 9000000,
      parent_position_code: "JBT0000004", // Reports to Soft Eng Lead
      sort_order: 3,
      description: "Staff Senior",
    },
    // ---> DIV 2: IT Infrastructure (DIV0101002)
    {
      position_code: "JBT0000006",
      office_code: "OFC0000001",
      department_code: "DPT0100001",
      division_code: "DIV0101002",
      name: "Infrastructure Manager",
      base_salary: 12000000,
      parent_position_code: "JBT0000003", // Reports to Head of Tech
      sort_order: 2,
      description: "Kepala Divisi Infra",
    },
    {
      position_code: "JBT0000007",
      office_code: "OFC0000001",
      department_code: "DPT0100001",
      division_code: "DIV0101002",
      name: "DevOps Engineer",
      base_salary: 9000000,
      parent_position_code: "JBT0000006", // Reports to Infra Lead
      sort_order: 3,
      description: "Staff DevOps",
    },

    // -------------------------------------------------------
    // DEPT 2: Human Capital (DPT0100002)
    // -------------------------------------------------------
    {
      position_code: "JBT0000008",
      office_code: "OFC0000001",
      department_code: "DPT0100002",
      division_code: null,
      name: "Head of Human Capital",
      base_salary: 16000000,
      parent_position_code: "JBT0000001", // Reports to CEO
      sort_order: 1,
      description: "Kepala Departemen HR",
    },
    // ---> DIV 1: Recruitment (DIV0102001)
    {
      position_code: "JBT0000009",
      office_code: "OFC0000001",
      department_code: "DPT0100002",
      division_code: "DIV0102001",
      name: "Recruitment Manager",
      base_salary: 10000000,
      parent_position_code: "JBT0000008", // Reports to Head of HC
      sort_order: 2,
      description: "Kepala Divisi Rekrutmen",
    },
    {
      position_code: "JBT0000010",
      office_code: "OFC0000001",
      department_code: "DPT0100002",
      division_code: "DIV0102001",
      name: "Talent Sourcer",
      base_salary: 6000000,
      parent_position_code: "JBT0000009", // Reports to Recruitment Manager
      sort_order: 3,
      description: "Staff",
    },
    // ---> DIV 2: People Dev (DIV0102002)
    {
      position_code: "JBT0000011",
      office_code: "OFC0000001",
      department_code: "DPT0100002",
      division_code: "DIV0102002",
      name: "L&D Manager",
      base_salary: 10000000,
      parent_position_code: "JBT0000008", // Reports to Head of HC
      sort_order: 2,
      description: "Kepala Divisi L&D",
    },

    // =======================================================
    // 2. KANTOR CABANG SURABAYA (OFC0000002)
    // =======================================================
    // -------------------------------------------------------
    // DEPT 1: Regional Sales (DPT0200001)
    // -------------------------------------------------------
    {
      position_code: "JBT0000021",
      office_code: "OFC0000002",
      department_code: "DPT0200001",
      division_code: null,
      name: "Head of Regional Sales",
      base_salary: 12000000,
      parent_position_code: "JBT0000002", // Reports to Branch Manager
      sort_order: 1,
      description: "Kepala Departemen Sales",
    },
    // ---> DIV 1: B2B Sales (DIV0201001)
    {
      position_code: "JBT0000022",
      office_code: "OFC0000002",
      department_code: "DPT0200001",
      division_code: "DIV0201001",
      name: "B2B Sales Manager",
      base_salary: 8000000,
      parent_position_code: "JBT0000021", // Reports to Head of Sales
      sort_order: 2,
      description: "Kepala Divisi B2B",
    },
    // ---> DIV 2: Direct Sales (DIV0201002)
    {
      position_code: "JBT0000023",
      office_code: "OFC0000002",
      department_code: "DPT0200001",
      division_code: "DIV0201002",
      name: "Direct Sales Manager",
      base_salary: 8000000,
      parent_position_code: "JBT0000021", // Reports to Head of Sales
      sort_order: 2,
      description: "Kepala Divisi Retail",
    },

    // -------------------------------------------------------
    // DEPT 2: Area Marketing (DPT0200002)
    // -------------------------------------------------------
    {
      position_code: "JBT0000025",
      office_code: "OFC0000002",
      department_code: "DPT0200002",
      division_code: null,
      name: "Head of Area Marketing",
      base_salary: 12000000,
      parent_position_code: "JBT0000002", // Reports to Branch Manager
      sort_order: 1,
      description: "Kepala Departemen Marketing",
    },
    // ---> DIV 1: Digital Mkt (DIV0202001)
    {
      position_code: "JBT0000026",
      office_code: "OFC0000002",
      department_code: "DPT0200002",
      division_code: "DIV0202001",
      name: "Digital Spv Manager",
      base_salary: 8000000,
      parent_position_code: "JBT0000025", // Reports to Head of Marketing
      sort_order: 2,
      description: "Kepala Divisi Digital",
    },
    // ---> DIV 2: Events (DIV0202002)
    {
      position_code: "JBT0000027",
      office_code: "OFC0000002",
      department_code: "DPT0200002",
      division_code: "DIV0202002",
      name: "Event Manager",
      base_salary: 8000000,
      parent_position_code: "JBT0000025", // Reports to Head of Marketing
      sort_order: 2,
      description: "Kepala Divisi Event",
    },
  ];

  await knex("master_positions")
    .insert(positions)
    .onConflict("position_code")
    .merge();

  // A. Office Leaders
  await knex("master_offices")
    .where("office_code", "OFC0000001")
    .update({ leader_position_code: "JBT0000001" });
  await knex("master_offices")
    .where("office_code", "OFC0000002")
    .update({ leader_position_code: "JBT0000002" });

  // B. Department Leaders
  await knex("master_departments")
    .where("department_code", "DPT0100001")
    .update({ leader_position_code: "JBT0000003" });
  await knex("master_departments")
    .where("department_code", "DPT0100002")
    .update({ leader_position_code: "JBT0000008" });
  await knex("master_departments")
    .where("department_code", "DPT0200001")
    .update({ leader_position_code: "JBT0000021" });
  await knex("master_departments")
    .where("department_code", "DPT0200002")
    .update({ leader_position_code: "JBT0000025" });

  // C. DIVISION LEADERS
  const divLeaders = [
    { division_code: "DIV0101001", leader: "JBT0000004" }, // Soft Eng
    { division_code: "DIV0101002", leader: "JBT0000006" }, // Infra
    { division_code: "DIV0102001", leader: "JBT0000009" }, // Recruitment
    { division_code: "DIV0102002", leader: "JBT0000011" }, // L&D
    { division_code: "DIV0201001", leader: "JBT0000022" }, // B2B Sales
    { division_code: "DIV0201002", leader: "JBT0000023" }, // Direct Sales
    { division_code: "DIV0202001", leader: "JBT0000026" }, // Digital
    { division_code: "DIV0202002", leader: "JBT0000027" }, // Events
  ];
  for (const item of divLeaders) {
    await knex("master_divisions")
      .where("division_code", item.division_code)
      .update({ leader_position_code: item.leader });
  }
}
