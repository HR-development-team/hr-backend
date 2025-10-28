import knex from "knex";
import bcrypt from "bcrypt";

type Knex = knex.Knex;

export async function seed(knex: Knex): Promise<void> {
  // 1. Deletes ALL existing entries in reverse order of dependency
  await knex("users").del();
  await knex("employees").del();
  await knex("positions").del();
  await knex("departments").del();

  // 2. Seed Departments
  const [techDepartment] = await knex("departments").insert([
    { name: "Technology" },
  ]);

  // 3. Seed Positions
  const [backendPosition] = await knex("positions").insert([
    {
      name: "Backend Developer",
      department_id: techDepartment,
    },
  ]);

  // 4. Seed the first Employee (who will be the Admin)
  const [adminEmployee] = await knex("employees").insert([
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

  await knex("users").insert([
    {
      email: "admin@marstech.com",
      password: hashedPassword,
      role: "admin", // Set the role directly to 'admin'
      employee_id: adminEmployee,
    },
  ]);

  console.log("Database seeded successfully with initial admin user!");
}
