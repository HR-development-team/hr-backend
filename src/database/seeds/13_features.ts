import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Clear existing data
  await knex("features").del();

  // 2. Insert Features based on Sidebar Requirements
  await knex("features").insert([
    // --- System Management ---
    {
      feature_code: "FTR0000001",
      name: "User Management",
      description: "Manage system users (Login access)",
    },
    {
      feature_code: "FTR0000002",
      name: "Role Management",
      description: "Manage roles and feature permissions",
    },

    // --- Master Data (Core) ---
    {
      feature_code: "FTR0000003",
      name: "Employee Management",
      description: "Manage employee profiles and data",
    },
    {
      feature_code: "FTR0000004",
      name: "Office Management",
      description: "Manage office branches and locations",
    },
    {
      feature_code: "FTR0000005",
      name: "Department Management",
      description: "Manage departments structure",
    },
    {
      feature_code: "FTR0000006",
      name: "Division Management",
      description: "Manage divisions structure",
    },
    {
      feature_code: "FTR0000007",
      name: "Position Management",
      description: "Manage job positions and salaries",
    },

    // --- Organization View ---
    {
      feature_code: "FTR0000008",
      name: "Organization Management",
      description: "View organization hierarchy chart",
    },

    // --- Transactions (Leaves) ---
    {
      feature_code: "FTR0000009",
      name: "Leave Request",
      description: "Manage and approve leave requests",
    },
    {
      feature_code: "FTR0000010",
      name: "Leave Balance",
      description: "View and adjust employee leave balances",
    },
  ]);
}
