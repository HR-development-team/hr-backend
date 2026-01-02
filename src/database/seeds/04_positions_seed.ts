import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Opsional: Hapus data lama agar bersih saat re-seed
  // await knex("master_positions").del();

  const positions = [
    // =======================================================
    // KANTOR PUSAT (01)
    // =======================================================

    // --- DIV0101001: Software Engineering ---
    {
      position_code: "JBT0000001",
      division_code: "DIV0101001",
      name: "Engineering Manager",
      base_salary: 18000000,
      parent_position_code: null, // Top level di divisi ini
      sort_order: 1,
      description: "Kepala Engineering",
    },
    {
      position_code: "JBT0000002",
      division_code: "DIV0101001",
      name: "Senior Backend Engineer",
      base_salary: 12000000,
      parent_position_code: "JBT0000001", // Lapor ke Manager
      sort_order: 2,
      description: "Engineer Senior",
    },

    // --- DIV0101002: IT Infrastructure ---
    {
      position_code: "JBT0000003",
      division_code: "DIV0101002",
      name: "Infrastructure Lead",
      base_salary: 15000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Infra",
    },
    {
      position_code: "JBT0000004",
      division_code: "DIV0101002",
      name: "DevOps Engineer",
      base_salary: 10000000,
      parent_position_code: "JBT0000003",
      sort_order: 2,
      description: "Staff DevOps",
    },

    // --- DIV0102001: Recruitment ---
    {
      position_code: "JBT0000005",
      division_code: "DIV0102001",
      name: "Recruitment Manager",
      base_salary: 14000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager Rekrutmen",
    },
    {
      position_code: "JBT0000006",
      division_code: "DIV0102001",
      name: "Talent Sourcer",
      base_salary: 7000000,
      parent_position_code: "JBT0000005",
      sort_order: 2,
      description: "Staff Sourcing",
    },

    // --- DIV0102002: People Development ---
    {
      position_code: "JBT0000007",
      division_code: "DIV0102002",
      name: "L&D Manager",
      base_salary: 14000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager Training",
    },
    {
      position_code: "JBT0000008",
      division_code: "DIV0102002",
      name: "Training Facilitator",
      base_salary: 8000000,
      parent_position_code: "JBT0000007",
      sort_order: 2,
      description: "Trainer",
    },

    // --- DIV0103001: Accounting ---
    {
      position_code: "JBT0000009",
      division_code: "DIV0103001",
      name: "Accounting Head",
      base_salary: 15000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Akunting",
    },
    {
      position_code: "JBT0000010",
      division_code: "DIV0103001",
      name: "Senior Accountant",
      base_salary: 9000000,
      parent_position_code: "JBT0000009",
      sort_order: 2,
      description: "Akuntan Senior",
    },

    // --- DIV0103002: Treasury ---
    {
      position_code: "JBT0000011",
      division_code: "DIV0103002",
      name: "Finance Manager",
      base_salary: 15000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager Keuangan",
    },
    {
      position_code: "JBT0000012",
      division_code: "DIV0103002",
      name: "Cashier",
      base_salary: 6000000,
      parent_position_code: "JBT0000011",
      sort_order: 2,
      description: "Kasir Pusat",
    },

    // --- DIV0104001: Corporate Legal ---
    {
      position_code: "JBT0000013",
      division_code: "DIV0104001",
      name: "Legal Manager",
      base_salary: 16000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager Legal",
    },
    {
      position_code: "JBT0000014",
      division_code: "DIV0104001",
      name: "Legal Staff",
      base_salary: 8000000,
      parent_position_code: "JBT0000013",
      sort_order: 2,
      description: "Staff Legal",
    },

    // --- DIV0104002: Internal Audit ---
    {
      position_code: "JBT0000015",
      division_code: "DIV0104002",
      name: "Head of Audit",
      base_salary: 16000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Audit",
    },
    {
      position_code: "JBT0000016",
      division_code: "DIV0104002",
      name: "Junior Auditor",
      base_salary: 7500000,
      parent_position_code: "JBT0000015",
      sort_order: 2,
      description: "Auditor Junior",
    },

    // --- DIV0105001: Procurement ---
    {
      position_code: "JBT0000017",
      division_code: "DIV0105001",
      name: "Procurement Head",
      base_salary: 13000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Pengadaan",
    },
    {
      position_code: "JBT0000018",
      division_code: "DIV0105001",
      name: "Purchasing Staff",
      base_salary: 6500000,
      parent_position_code: "JBT0000017",
      sort_order: 2,
      description: "Admin Purchasing",
    },

    // --- DIV0105002: Logistics Planning ---
    {
      position_code: "JBT0000019",
      division_code: "DIV0105002",
      name: "Supply Chain Manager",
      base_salary: 14000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager SCM",
    },
    {
      position_code: "JBT0000020",
      division_code: "DIV0105002",
      name: "Logistics Admin",
      base_salary: 6000000,
      parent_position_code: "JBT0000019",
      sort_order: 2,
      description: "Admin Logistik",
    },

    // =======================================================
    // KANTOR CABANG SURABAYA (02)
    // =======================================================

    // --- DIV0201001: B2B Sales ---
    {
      position_code: "JBT0000021",
      division_code: "DIV0201001",
      name: "B2B Sales Manager",
      base_salary: 12000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager B2B",
    },
    {
      position_code: "JBT0000022",
      division_code: "DIV0201001",
      name: "Account Executive",
      base_salary: 5500000,
      parent_position_code: "JBT0000021",
      sort_order: 2,
      description: "AE Sales",
    },

    // --- DIV0201002: Direct Sales ---
    {
      position_code: "JBT0000023",
      division_code: "DIV0201002",
      name: "Retail Sales Head",
      base_salary: 11000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Retail",
    },
    {
      position_code: "JBT0000024",
      division_code: "DIV0201002",
      name: "Sales Promotor",
      base_salary: 4500000,
      parent_position_code: "JBT0000023",
      sort_order: 2,
      description: "SPG/SPB",
    },

    // --- DIV0202001: Digital Marketing ---
    {
      position_code: "JBT0000025",
      division_code: "DIV0202001",
      name: "Digital Spv",
      base_salary: 9000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Supervisor Digital",
    },
    {
      position_code: "JBT0000026",
      division_code: "DIV0202001",
      name: "Content Creator",
      base_salary: 5000000,
      parent_position_code: "JBT0000025",
      sort_order: 2,
      description: "Kreator Konten",
    },

    // --- DIV0202002: Event & Activation ---
    {
      position_code: "JBT0000027",
      division_code: "DIV0202002",
      name: "Event Coordinator",
      base_salary: 8000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Koordinator Event",
    },
    {
      position_code: "JBT0000028",
      division_code: "DIV0202002",
      name: "Event Crew",
      base_salary: 4200000,
      parent_position_code: "JBT0000027",
      sort_order: 2,
      description: "Crew Lapangan",
    },

    // --- DIV0203001: Customer Service ---
    {
      position_code: "JBT0000029",
      division_code: "DIV0203001",
      name: "CS Leader",
      base_salary: 8000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Team Leader CS",
    },
    {
      position_code: "JBT0000030",
      division_code: "DIV0203001",
      name: "CS Agent",
      base_salary: 4500000,
      parent_position_code: "JBT0000029",
      sort_order: 2,
      description: "Agent",
    },

    // --- DIV0203002: Technical Support ---
    {
      position_code: "JBT0000031",
      division_code: "DIV0203002",
      name: "Technical Lead",
      base_salary: 9000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Teknisi",
    },
    {
      position_code: "JBT0000032",
      division_code: "DIV0203002",
      name: "Support Technician",
      base_salary: 5000000,
      parent_position_code: "JBT0000031",
      sort_order: 2,
      description: "Teknisi Lapangan",
    },

    // --- DIV0204001: General Admin ---
    {
      position_code: "JBT0000033",
      division_code: "DIV0204001",
      name: "Branch Admin Head",
      base_salary: 8500000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Admin Cabang",
    },
    {
      position_code: "JBT0000034",
      division_code: "DIV0204001",
      name: "Admin Staff",
      base_salary: 4500000,
      parent_position_code: "JBT0000033",
      sort_order: 2,
      description: "Staff Admin",
    },

    // --- DIV0204002: Facility Management ---
    {
      position_code: "JBT0000035",
      division_code: "DIV0204002",
      name: "GA Supervisor",
      base_salary: 7500000,
      parent_position_code: null,
      sort_order: 1,
      description: "SPV GA",
    },
    {
      position_code: "JBT0000036",
      division_code: "DIV0204002",
      name: "OB/Cleaning",
      base_salary: 4200000,
      parent_position_code: "JBT0000035",
      sort_order: 2,
      description: "Office Boy",
    },

    // --- DIV0205001: Warehouse Ops ---
    {
      position_code: "JBT0000037",
      division_code: "DIV0205001",
      name: "Warehouse Manager",
      base_salary: 9500000,
      parent_position_code: null,
      sort_order: 1,
      description: "Kepala Gudang",
    },
    {
      position_code: "JBT0000038",
      division_code: "DIV0205001",
      name: "Picker/Packer",
      base_salary: 4500000,
      parent_position_code: "JBT0000037",
      sort_order: 2,
      description: "Staff Gudang",
    },

    // --- DIV0205002: Stock Control ---
    {
      position_code: "JBT0000039",
      division_code: "DIV0205002",
      name: "Inventory Analyst",
      base_salary: 8000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Analis Inventori",
    },
    {
      position_code: "JBT0000040",
      division_code: "DIV0205002",
      name: "Stock Admin",
      base_salary: 4500000,
      parent_position_code: "JBT0000039",
      sort_order: 2,
      description: "Admin Stok",
    },
  ];

  await knex("master_positions")
    .insert(positions)
    .onConflict("position_code")
    .merge();
}
