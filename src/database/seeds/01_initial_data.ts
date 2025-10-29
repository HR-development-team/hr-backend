import knex from "knex";
import bcrypt from "bcrypt";

type Knex = knex.Knex;

const TABLE_KEYS = {
  // Master Data
  DEPARTMENTS: "master_departments",
  POSITIONS: "master_positions",

  // Transactional/Core Data
  EMPLOYEES: "employees",
  USERS: "users",
  LEAVE_REQUESTS: "leave_requests",
};

export async function seed(knex: Knex): Promise<void> {
  // 1. Deletes ALL existing entries in reverse order of dependency
  await knex(TABLE_KEYS.USERS).del();
  await knex(TABLE_KEYS.EMPLOYEES).del();
  await knex(TABLE_KEYS.POSITIONS).del();
  await knex(TABLE_KEYS.DEPARTMENTS).del();

  // 2. Seed Departments
  const [techDepartment] = await knex(TABLE_KEYS.DEPARTMENTS).insert([
    { name: "Technology" },
  ]);

  // 3. Seed Positions
  const [backendPosition] = await knex(TABLE_KEYS.POSITIONS).insert([
    {
      name: "Backend Developer",
      department_id: techDepartment,
    },
  ]);

  // 4. Seed the first Employee (who will be the Admin)
  const [adminEmployee] = await knex(TABLE_KEYS.EMPLOYEES).insert([
    {
      first_name: "System",
      last_name: "Admin",
      contact_phone: "081234567890",
      address: "Company HQ",
      join_date: new Date(),
      position_id: backendPosition,
    },
  ]);

  // 5. Seed the first User (The Admin Account)
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Password123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await knex(TABLE_KEYS.USERS).insert([
    {
      email: "admin@marstech.com",
      password: hashedPassword,
      role: "admin", // Set the role directly to 'admin'
      employee_id: adminEmployee,
    },
  ]);

  console.log("Database seeded successfully with initial admin user!");
}
