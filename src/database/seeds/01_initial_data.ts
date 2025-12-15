import type { Knex } from "knex";
import bcrypt from "bcrypt";

const TABLE_KEYS = {
  USERS: "users",
  ROLES: "roles",
  EMPLOYEES: "master_employees",
  POSITIONS: "master_positions",
  DIVISIONS: "master_divisions",
  DEPARTMENTS: "master_departments",
  OFFICES: "master_offices",
  LEAVE_TYPES: "master_leave_types",
  PAYROLL_PERIODS: "payroll_periods",
};

export async function seed(knex: Knex): Promise<void> {
  // CATATAN: Tidak ada delete/truncate disini karena sudah dilakukan di 00_cleanup.ts

  // 1. Seed Offices (DATA DARI FILE 04 - LENGKAP LAT/LONG)
  await knex(TABLE_KEYS.OFFICES).insert([
    {
      office_code: "OFC0000001",
      name: "Kantor Pusat ",
      address: "Jl. Sudirman No. 1",
      latitude: -6.2088,
      longitude: 106.8456,
      radius_meters: 100,
      parent_office_code: null,
      sort_order: 1,
      description: "Pusat Operasional",
    },
    {
      office_code: "OFC0000002",
      name: "Kantor Cabang Jawa Timur",
      address: "Surabaya",
      latitude: -7.2575,
      longitude: 112.7521,
      radius_meters: 50,
      parent_office_code: "OFC0000001",
      sort_order: 2,
      description: "Cabang Jatim",
    },
    {
      office_code: "OFC0000003",
      name: "Kantor Unit Madiun",
      address: "Madiun",
      latitude: -7.6298,
      longitude: 111.5177,
      radius_meters: 30,
      parent_office_code: "OFC0000002",
      sort_order: 3,
      description: "Unit Madiun",
    },
    {
      office_code: "OFC0000004",
      name: "Kantor Cabang Jawa Tengah",
      address: "Semarang",
      latitude: -6.9932,
      longitude: 110.4203,
      radius_meters: 50,
      parent_office_code: "OFC0000001",
      sort_order: 4,
      description: "Cabang Jateng",
    },
  ]);

  // 2. Seed Departments
  await knex(TABLE_KEYS.DEPARTMENTS).insert([
    {
      department_code: "DPT0000001",
      name: "Technology",
      office_code: "OFC0000001",
      description: "Tech",
    },
    {
      department_code: "DPT0000002",
      name: "Human Resources",
      office_code: "OFC0000001",
      description: "HR",
    },
    {
      department_code: "DPT0000003",
      name: "Sales",
      office_code: "OFC0000002",
      description: "Sales Jatim",
    },
    {
      department_code: "DPT0000004",
      name: "Finance",
      office_code: "OFC0000001",
      description: "Finance",
    },
  ]);

  // 3. Seed Divisions
  await knex(TABLE_KEYS.DIVISIONS).insert([
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

  // 4. Seed Positions (UPDATED: Added parent_position_code & sort_order)
  await knex(TABLE_KEYS.POSITIONS).insert([
    // --- LEADERS (Level 1) ---
    {
      position_code: "JBT0000002",
      division_code: "DIV0000001",
      name: "Senior Software Engineer",
      base_salary: 12000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Lead",
    },
    {
      position_code: "JBT0000005",
      division_code: "DIV0000002",
      name: "Network Administrator",
      base_salary: 9000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Net Admin",
    },
    {
      position_code: "JBT0000009",
      division_code: "DIV0000004",
      name: "HR Manager",
      base_salary: 13000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager",
    },
    {
      position_code: "JBT0000011",
      division_code: "DIV0000005",
      name: "Business Dev Manager",
      base_salary: 14000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Manager",
    },
    {
      position_code: "JBT0000013",
      division_code: "DIV0000006",
      name: "Senior Account Manager",
      base_salary: 11000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Senior",
    },
    {
      position_code: "JBT0000015",
      division_code: "DIV0000007",
      name: "Senior Accountant",
      base_salary: 12000000,
      parent_position_code: null,
      sort_order: 1,
      description: "Senior",
    },

    // --- STAFF (Level 2 - Punya Parent) ---
    {
      position_code: "JBT0000001",
      division_code: "DIV0000001",
      name: "Software Engineer",
      base_salary: 8000000,
      parent_position_code: "JBT0000002",
      sort_order: 2,
      description: "Dev",
    },
    {
      position_code: "JBT0000003",
      division_code: "DIV0000001",
      name: "QA Engineer",
      base_salary: 7000000,
      parent_position_code: "JBT0000002",
      sort_order: 3,
      description: "QA",
    },
    {
      position_code: "JBT0000004",
      division_code: "DIV0000002",
      name: "IT Support Specialist",
      base_salary: 6000000,
      parent_position_code: "JBT0000005",
      sort_order: 2,
      description: "Support",
    },
    {
      position_code: "JBT0000006",
      division_code: "DIV0000003",
      name: "Recruitment Officer",
      base_salary: 6500000,
      parent_position_code: "JBT0000009",
      sort_order: 2,
      description: "Recruiter",
    },
    {
      position_code: "JBT0000007",
      division_code: "DIV0000003",
      name: "Talent Acquisition Spc",
      base_salary: 8500000,
      parent_position_code: "JBT0000009",
      sort_order: 3,
      description: "Talent",
    },
    {
      position_code: "JBT0000008",
      division_code: "DIV0000004",
      name: "HR Officer",
      base_salary: 7000000,
      parent_position_code: "JBT0000009",
      sort_order: 2,
      description: "Officer",
    },
    {
      position_code: "JBT0000010",
      division_code: "DIV0000005",
      name: "BizDev Officer",
      base_salary: 7500000,
      parent_position_code: "JBT0000011",
      sort_order: 2,
      description: "Officer",
    },
    {
      position_code: "JBT0000012",
      division_code: "DIV0000006",
      name: "Account Executive",
      base_salary: 7000000,
      parent_position_code: "JBT0000013",
      sort_order: 2,
      description: "AE",
    },
    {
      position_code: "JBT0000014",
      division_code: "DIV0000007",
      name: "Accountant",
      base_salary: 8000000,
      parent_position_code: "JBT0000015",
      sort_order: 2,
      description: "Staff",
    },
    {
      position_code: "JBT0000016",
      division_code: "DIV0000008",
      name: "Financial Analyst",
      base_salary: 9000000,
      parent_position_code: "JBT0000015",
      sort_order: 2,
      description: "Analyst",
    },
    {
      position_code: "JBT0000017",
      division_code: "DIV0000008",
      name: "Budget Officer",
      base_salary: 9500000,
      parent_position_code: "JBT0000015",
      sort_order: 3,
      description: "Budget",
    },
  ]);

  // 5. Seed Roles
  await knex(TABLE_KEYS.ROLES).insert([
    { role_code: "ROL0000001", name: "SuperAdmin", description: "Full Access" },
    { role_code: "ROL0000002", name: "SystemAdmin", description: "Tech Admin" },
    {
      role_code: "ROL0000003",
      name: "HeadOfficeStaff",
      description: "HO Staff",
    },
    {
      role_code: "ROL0000004",
      name: "BranchManager",
      description: "Branch Lead",
    },
    { role_code: "ROL0000005", name: "OfficeStaff", description: "Staff" },
    { role_code: "ROL0000006", name: "Auditor", description: "ReadOnly" },
  ]);

  // 6. Seed Users
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "Password123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  await knex(TABLE_KEYS.USERS).insert([
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

  // 7. Seed Employees
  await knex(TABLE_KEYS.EMPLOYEES).insert([
    {
      employee_code: "MR0001",
      user_code: "USR0000001",
      position_code: "JBT0000001",
      office_code: "OFC0000001",
      department_code: "DPT0000001", // Penting! Relasi ke Dept
      full_name: "Budi Pratama",
      ktp_number: "3578123409876543",
      birth_place: "Surabaya",
      birth_date: "1997-08-15",
      gender: "laki-laki",
      address: "Surabaya",
      contact_phone: "081234567890",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-11-20",
      employment_status: "aktif",
      education: "S1",
      blood_type: "O",
      bpjs_ketenagakerjaan: "23098",
      bpjs_kesehatan: "12098",
      npwp: "54.321",
      bank_account: "BCA",
    },
    {
      employee_code: "MR0002",
      user_code: "USR0000002",
      position_code: "JBT0000006",
      office_code: "OFC0000002",
      department_code: "DPT0000002", // Penting!
      full_name: "Siti Rahmawati",
      ktp_number: "3578012345678912",
      birth_place: "Malang",
      birth_date: "1995-03-28",
      gender: "perempuan",
      address: "Malang",
      contact_phone: "08234",
      religion: "Islam",
      maritial_status: "Married",
      join_date: "2023-07-10",
      employment_status: "aktif",
      education: "S1",
      blood_type: "A",
      bpjs_ketenagakerjaan: "23012",
      bpjs_kesehatan: "12012",
      npwp: "45.678",
      bank_account: "Mandiri",
    },
    {
      employee_code: "MR0003",
      user_code: "USR0000003",
      position_code: "JBT0000014",
      office_code: "OFC0000002",
      department_code: "DPT0000004", // Penting!
      full_name: "Andi Setiawan",
      ktp_number: "3578456712345678",
      birth_place: "Jakarta",
      birth_date: "1992-12-05",
      gender: "laki-laki",
      address: "Jakarta",
      contact_phone: "08321",
      religion: "Kristen",
      maritial_status: "Married",
      join_date: "2022-01-17",
      employment_status: "aktif",
      education: "S1",
      blood_type: "B",
      bpjs_ketenagakerjaan: "23987",
      bpjs_kesehatan: "12987",
      npwp: "12.987",
      bank_account: "BRI",
    },
    {
      employee_code: "MR0005",
      user_code: "USR0000005",
      position_code: "POS0000014", // Accountant
      office_code: "OFC0000001", // Head Office Jakarta
      full_name: "Rina Kusuma",
      ktp_number: "3171012345678901",
      birth_place: "Jakarta",
      birth_date: "1996-02-14",
      gender: "perempuan",
      address: "Jl. Tebet Raya No. 15, Jakarta Selatan",
      contact_phone: "085612345678",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-01-10",
      employment_status: "aktif",
      education: "S1 Akuntansi",
      blood_type: "O",
      profile_picture: null,
      bpjs_ketenagakerjaan: "112233445566",
      bpjs_kesehatan: "665544332211",
      npwp: "11.222.333.4-555.000",
      bank_account: "BCA 5566778899",
    },
    // NEW EMPLOYEE 2 (Linked to USR0000006)
    {
      employee_code: "MR0006",
      user_code: "USR0000006",
      position_code: "POS0000004", // IT Support Specialist
      office_code: "OFC0000002", // Branch Office Bandung
      full_name: "Dimas Anggara",
      ktp_number: "3273012345678901",
      birth_place: "Bandung",
      birth_date: "1999-07-20",
      gender: "laki-laki",
      address: "Jl. Dago No. 88, Bandung, Jawa Barat",
      contact_phone: "081908765432",
      religion: "Islam",
      maritial_status: "Single",
      join_date: "2024-03-01",
      employment_status: "aktif",
      education: "D3 Teknik Komputer",
      blood_type: "B",
      profile_picture: null,
      bpjs_ketenagakerjaan: "778899001122",
      bpjs_kesehatan: "223344556677",
      npwp: "99.888.777.6-555.000",
      bank_account: "Mandiri 1231231234",
    },
  ]);

  // 8. Seed Leave & Payroll
  await knex(TABLE_KEYS.LEAVE_TYPES).insert([
    {
      name: "Cuti Tahunan",
      type_code: "TCT0000001",
      deduction: 10000,
      description: "Annual",
    },
    {
      name: "Cuti Sakit",
      type_code: "TCT0000002",
      deduction: 0,
      description: "Sick",
    },
  ]);

  await knex(TABLE_KEYS.PAYROLL_PERIODS).insert([
    {
      period_code: "PRD-JAN25",
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    },
    {
      period_code: "PRD-FEB25",
      start_date: "2025-02-01",
      end_date: "2025-02-28",
    },
  ]);

  console.log("✅ Master Data Seeded Successfully!");
}
