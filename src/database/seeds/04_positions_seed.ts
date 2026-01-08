import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama
  await knex("master_positions").del();

  await knex("master_positions")
    .insert([
      // ==============================================================================
      // 1. KANTOR PUSAT (OFC01) - TOTAL 20 POSISI (JBT 1-20)
      // ==============================================================================

      // --- Dept 1: Tech (DPT0100001) ---
      // Divisi: Software Engineering (DIV0101001)
      {
        position_code: "JBT0000001",
        division_code: "DIV0101001",
        name: "Head of Software Eng",
        base_salary: 15000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000002",
        division_code: "DIV0101001",
        name: "Software Engineer",
        base_salary: 8000000,
        parent_position_code: "JBT0000001",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: IT Infrastructure (DIV0101002)
      {
        position_code: "JBT0000003",
        division_code: "DIV0101002",
        name: "Head of Infra",
        base_salary: 14000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000004",
        division_code: "DIV0101002",
        name: "DevOps Engineer",
        base_salary: 8000000,
        parent_position_code: "JBT0000003",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 2: HR (DPT0100002) ---
      // Divisi: Recruitment & Branding (DIV0102001)
      {
        position_code: "JBT0000005",
        division_code: "DIV0102001",
        name: "Head of Recruitment",
        base_salary: 12000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000006",
        division_code: "DIV0102001",
        name: "Recruiter Staff",
        base_salary: 6000000,
        parent_position_code: "JBT0000005",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: People Development (DIV0102002)
      {
        position_code: "JBT0000007",
        division_code: "DIV0102002",
        name: "Head of People Dev",
        base_salary: 12000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000008",
        division_code: "DIV0102002",
        name: "Trainer Staff",
        base_salary: 6000000,
        parent_position_code: "JBT0000007",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 3: Finance (DPT0100003) ---
      // Divisi: Accounting & Tax (DIV0103001)
      {
        position_code: "JBT0000009",
        division_code: "DIV0103001",
        name: "Head of Accounting",
        base_salary: 13000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000010",
        division_code: "DIV0103001",
        name: "Accountant",
        base_salary: 7000000,
        parent_position_code: "JBT0000009",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Treasury (DIV0103002)
      {
        position_code: "JBT0000011",
        division_code: "DIV0103002",
        name: "Head of Treasury",
        base_salary: 13000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000012",
        division_code: "DIV0103002",
        name: "Treasury Staff",
        base_salary: 7000000,
        parent_position_code: "JBT0000011",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 4: Legal (DPT0100004) ---
      // Divisi: Corporate Legal (DIV0104001)
      {
        position_code: "JBT0000013",
        division_code: "DIV0104001",
        name: "Head of Legal",
        base_salary: 14000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000014",
        division_code: "DIV0104001",
        name: "Legal Staff",
        base_salary: 7500000,
        parent_position_code: "JBT0000013",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Internal Audit (DIV0104002)
      {
        position_code: "JBT0000015",
        division_code: "DIV0104002",
        name: "Head of Audit",
        base_salary: 14000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000016",
        division_code: "DIV0104002",
        name: "Auditor",
        base_salary: 7500000,
        parent_position_code: "JBT0000015",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 5: SCM (DPT0100005) ---
      // Divisi: Procurement (DIV0105001)
      {
        position_code: "JBT0000017",
        division_code: "DIV0105001",
        name: "Head of Procurement",
        base_salary: 11000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000018",
        division_code: "DIV0105001",
        name: "Purchasing Staff",
        base_salary: 6000000,
        parent_position_code: "JBT0000017",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Logistics Planning (DIV0105002)
      {
        position_code: "JBT0000019",
        division_code: "DIV0105002",
        name: "Head of Logistics",
        base_salary: 11000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000020",
        division_code: "DIV0105002",
        name: "Logistics Admin",
        base_salary: 5500000,
        parent_position_code: "JBT0000019",
        sort_order: 2,
        description: "Staff",
      },

      // ==============================================================================
      // 2. KANTOR CABANG SURABAYA (OFC02) - TOTAL 20 POSISI (JBT 21-40)
      // ==============================================================================

      // --- Dept 1: Regional Sales ---
      // Divisi: B2B Sales Jatim (DIV0201001)
      {
        position_code: "JBT0000021",
        division_code: "DIV0201001",
        name: "Head of B2B Sales",
        base_salary: 10000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000022",
        division_code: "DIV0201001",
        name: "B2B Sales Staff",
        base_salary: 5000000,
        parent_position_code: "JBT0000021",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Direct Sales Jatim (DIV0201002)
      {
        position_code: "JBT0000023",
        division_code: "DIV0201002",
        name: "Head of Direct Sales",
        base_salary: 10000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000024",
        division_code: "DIV0201002",
        name: "Sales Promoter",
        base_salary: 5000000,
        parent_position_code: "JBT0000023",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 2: Area Marketing ---
      // Divisi: Digital Marketing Jatim (DIV0202001)
      {
        position_code: "JBT0000025",
        division_code: "DIV0202001",
        name: "Head of Digital Mkt",
        base_salary: 9000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000026",
        division_code: "DIV0202001",
        name: "Content Creator",
        base_salary: 5000000,
        parent_position_code: "JBT0000025",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Event & Activation (DIV0202002)
      {
        position_code: "JBT0000027",
        division_code: "DIV0202002",
        name: "Head of Events",
        base_salary: 9000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000028",
        division_code: "DIV0202002",
        name: "Event Crew",
        base_salary: 4500000,
        parent_position_code: "JBT0000027",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 3: Customer Experience ---
      // Divisi: Customer Service Jatim (DIV0203001)
      {
        position_code: "JBT0000029",
        division_code: "DIV0203001",
        name: "CS Supervisor",
        base_salary: 8000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000030",
        division_code: "DIV0203001",
        name: "CS Agent",
        base_salary: 4500000,
        parent_position_code: "JBT0000029",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Technical Support Jatim (DIV0203002)
      {
        position_code: "JBT0000031",
        division_code: "DIV0203002",
        name: "Tech Support Lead",
        base_salary: 8000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000032",
        division_code: "DIV0203002",
        name: "Technician",
        base_salary: 4500000,
        parent_position_code: "JBT0000031",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 4: Branch Operations ---
      // Divisi: General Admin Jatim (DIV0204001)
      {
        position_code: "JBT0000033",
        division_code: "DIV0204001",
        name: "Head of Admin",
        base_salary: 8000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000034",
        division_code: "DIV0204001",
        name: "Admin Staff",
        base_salary: 4500000,
        parent_position_code: "JBT0000033",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Facility Management (DIV0204002)
      {
        position_code: "JBT0000035",
        division_code: "DIV0204002",
        name: "GA Supervisor",
        base_salary: 7000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000036",
        division_code: "DIV0204002",
        name: "Office Boy",
        base_salary: 4000000,
        parent_position_code: "JBT0000035",
        sort_order: 2,
        description: "Staff",
      },

      // --- Dept 5: Inventory & Warehouse ---
      // Divisi: Warehouse Ops Jatim (DIV0205001)
      {
        position_code: "JBT0000037",
        division_code: "DIV0205001",
        name: "Head of Warehouse",
        base_salary: 8500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000038",
        division_code: "DIV0205001",
        name: "Warehouse Staff",
        base_salary: 4500000,
        parent_position_code: "JBT0000037",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Stock Control Jatim (DIV0205002)
      {
        position_code: "JBT0000039",
        division_code: "DIV0205002",
        name: "Stock Controller",
        base_salary: 8500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000040",
        division_code: "DIV0205002",
        name: "Stock Admin",
        base_salary: 4500000,
        parent_position_code: "JBT0000039",
        sort_order: 2,
        description: "Staff",
      },

      // ==============================================================================
      // 3. UNIT MADIUN (OFC03) - TOTAL 20 POSISI (JBT 41-60)
      // ==============================================================================

      // Dept 1: Unit Sales
      // Divisi: Sales Team A - Madiun (DIV0301001)
      {
        position_code: "JBT0000041",
        division_code: "DIV0301001",
        name: "Team Leader Sales A",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000042",
        division_code: "DIV0301001",
        name: "Salesman A",
        base_salary: 4000000,
        parent_position_code: "JBT0000041",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Sales Team B - Madiun (DIV0301002)
      {
        position_code: "JBT0000043",
        division_code: "DIV0301002",
        name: "Team Leader Sales B",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000044",
        division_code: "DIV0301002",
        name: "Salesman B",
        base_salary: 4000000,
        parent_position_code: "JBT0000043",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 2: Unit Admin
      // Divisi: Administration Madiun (DIV0302001)
      {
        position_code: "JBT0000045",
        division_code: "DIV0302001",
        name: "Head Admin Unit",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000046",
        division_code: "DIV0302001",
        name: "Admin Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000045",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Reporting Madiun (DIV0302002)
      {
        position_code: "JBT0000047",
        division_code: "DIV0302002",
        name: "Report Spv",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000048",
        division_code: "DIV0302002",
        name: "Report Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000047",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 3: Unit Warehouse
      // Divisi: Inbound Madiun (DIV0303001)
      {
        position_code: "JBT0000049",
        division_code: "DIV0303001",
        name: "Inbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000050",
        division_code: "DIV0303001",
        name: "Inbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000049",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Outbound Madiun (DIV0303002)
      {
        position_code: "JBT0000051",
        division_code: "DIV0303002",
        name: "Outbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000052",
        division_code: "DIV0303002",
        name: "Outbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000051",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 4: Unit Support
      // Divisi: Tech Support Madiun (DIV0304001)
      {
        position_code: "JBT0000053",
        division_code: "DIV0304001",
        name: "Tech Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000054",
        division_code: "DIV0304001",
        name: "Technician",
        base_salary: 3500000,
        parent_position_code: "JBT0000053",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Maintenance Madiun (DIV0304002)
      {
        position_code: "JBT0000055",
        division_code: "DIV0304002",
        name: "Maintenance Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000056",
        division_code: "DIV0304002",
        name: "Maintenance Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000055",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 5: Unit General
      // Divisi: GA Madiun (DIV0305001)
      {
        position_code: "JBT0000057",
        division_code: "DIV0305001",
        name: "GA Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000058",
        division_code: "DIV0305001",
        name: "Cleaner",
        base_salary: 3000000,
        parent_position_code: "JBT0000057",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Security Madiun (DIV0305002)
      {
        position_code: "JBT0000059",
        division_code: "DIV0305002",
        name: "Security Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000060",
        division_code: "DIV0305002",
        name: "Security Guard",
        base_salary: 3000000,
        parent_position_code: "JBT0000059",
        sort_order: 2,
        description: "Staff",
      },

      // ==============================================================================
      // 4. UNIT MALANG (OFC04) - TOTAL 20 POSISI (JBT 61-80)
      // ==============================================================================

      // Dept 1: Unit Sales
      // Divisi: Sales Team A - Malang (DIV0401001)
      {
        position_code: "JBT0000061",
        division_code: "DIV0401001",
        name: "Team Leader Sales A",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000062",
        division_code: "DIV0401001",
        name: "Salesman A",
        base_salary: 4000000,
        parent_position_code: "JBT0000061",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Sales Team B - Malang (DIV0401002)
      {
        position_code: "JBT0000063",
        division_code: "DIV0401002",
        name: "Team Leader Sales B",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000064",
        division_code: "DIV0401002",
        name: "Salesman B",
        base_salary: 4000000,
        parent_position_code: "JBT0000063",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 2: Unit Admin
      // Divisi: Administration Malang (DIV0402001)
      {
        position_code: "JBT0000065",
        division_code: "DIV0402001",
        name: "Head Admin Unit",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000066",
        division_code: "DIV0402001",
        name: "Admin Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000065",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Reporting Malang (DIV0402002)
      {
        position_code: "JBT0000067",
        division_code: "DIV0402002",
        name: "Report Spv",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000068",
        division_code: "DIV0402002",
        name: "Report Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000067",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 3: Unit Warehouse
      // Divisi: Inbound Malang (DIV0403001)
      {
        position_code: "JBT0000069",
        division_code: "DIV0403001",
        name: "Inbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000070",
        division_code: "DIV0403001",
        name: "Inbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000069",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Outbound Malang (DIV0403002)
      {
        position_code: "JBT0000071",
        division_code: "DIV0403002",
        name: "Outbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000072",
        division_code: "DIV0403002",
        name: "Outbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000071",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 4: Unit Support
      // Divisi: Tech Support Malang (DIV0404001)
      {
        position_code: "JBT0000073",
        division_code: "DIV0404001",
        name: "Tech Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000074",
        division_code: "DIV0404001",
        name: "Technician",
        base_salary: 3500000,
        parent_position_code: "JBT0000073",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Maintenance Malang (DIV0404002)
      {
        position_code: "JBT0000075",
        division_code: "DIV0404002",
        name: "Maintenance Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000076",
        division_code: "DIV0404002",
        name: "Maintenance Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000075",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 5: Unit General
      // Divisi: GA Malang (DIV0405001)
      {
        position_code: "JBT0000077",
        division_code: "DIV0405001",
        name: "GA Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000078",
        division_code: "DIV0405001",
        name: "Cleaner",
        base_salary: 3000000,
        parent_position_code: "JBT0000077",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Security Malang (DIV0405002)
      {
        position_code: "JBT0000079",
        division_code: "DIV0405002",
        name: "Security Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000080",
        division_code: "DIV0405002",
        name: "Security Guard",
        base_salary: 3000000,
        parent_position_code: "JBT0000079",
        sort_order: 2,
        description: "Staff",
      },

      // ==============================================================================
      // 5. UNIT KEDIRI (OFC05) - TOTAL 20 POSISI (JBT 81-100)
      // ==============================================================================

      // Dept 1: Unit Sales
      // Divisi: Sales Team A - Kediri (DIV0501001)
      {
        position_code: "JBT0000081",
        division_code: "DIV0501001",
        name: "Team Leader Sales A",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000082",
        division_code: "DIV0501001",
        name: "Salesman A",
        base_salary: 4000000,
        parent_position_code: "JBT0000081",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Sales Team B - Kediri (DIV0501002)
      {
        position_code: "JBT0000083",
        division_code: "DIV0501002",
        name: "Team Leader Sales B",
        base_salary: 6000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000084",
        division_code: "DIV0501002",
        name: "Salesman B",
        base_salary: 4000000,
        parent_position_code: "JBT0000083",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 2: Unit Admin
      // Divisi: Administration Kediri (DIV0502001)
      {
        position_code: "JBT0000085",
        division_code: "DIV0502001",
        name: "Head Admin Unit",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000086",
        division_code: "DIV0502001",
        name: "Admin Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000085",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Reporting Kediri (DIV0502002)
      {
        position_code: "JBT0000087",
        division_code: "DIV0502002",
        name: "Report Spv",
        base_salary: 5500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000088",
        division_code: "DIV0502002",
        name: "Report Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000087",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 3: Unit Warehouse
      // Divisi: Inbound Kediri (DIV0503001)
      {
        position_code: "JBT0000089",
        division_code: "DIV0503001",
        name: "Inbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000090",
        division_code: "DIV0503001",
        name: "Inbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000089",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Outbound Kediri (DIV0503002)
      {
        position_code: "JBT0000091",
        division_code: "DIV0503002",
        name: "Outbound Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000092",
        division_code: "DIV0503002",
        name: "Outbound Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000091",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 4: Unit Support
      // Divisi: Tech Support Kediri (DIV0504001)
      {
        position_code: "JBT0000093",
        division_code: "DIV0504001",
        name: "Tech Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000094",
        division_code: "DIV0504001",
        name: "Technician",
        base_salary: 3500000,
        parent_position_code: "JBT0000093",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Maintenance Kediri (DIV0504002)
      {
        position_code: "JBT0000095",
        division_code: "DIV0504002",
        name: "Maintenance Spv",
        base_salary: 5000000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000096",
        division_code: "DIV0504002",
        name: "Maintenance Staff",
        base_salary: 3500000,
        parent_position_code: "JBT0000095",
        sort_order: 2,
        description: "Staff",
      },

      // Dept 5: Unit General
      // Divisi: GA Kediri (DIV0505001)
      {
        position_code: "JBT0000097",
        division_code: "DIV0505001",
        name: "GA Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000098",
        division_code: "DIV0505001",
        name: "Cleaner",
        base_salary: 3000000,
        parent_position_code: "JBT0000097",
        sort_order: 2,
        description: "Staff",
      },
      // Divisi: Security Kediri (DIV0505002)
      {
        position_code: "JBT0000099",
        division_code: "DIV0505002",
        name: "Security Spv",
        base_salary: 4500000,
        parent_position_code: null,
        sort_order: 1,
        description: "Lead",
      },
      {
        position_code: "JBT0000100",
        division_code: "DIV0505002",
        name: "Security Guard",
        base_salary: 3000000,
        parent_position_code: "JBT0000099",
        sort_order: 2,
        description: "Staff",
      },
    ])
    .onConflict("position_code")
    .merge();
}
