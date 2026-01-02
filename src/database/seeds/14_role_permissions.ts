import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Clear existing data
  await knex("role_permissions").del();

  const superAdminRole = "ROL0000001";
  const adminRole = "ROL0000002";
  const employeeRole = "ROL0000003";

  // List of all features created in the 'features' seeder
  const allFeatures = [
    "FTR0000001", // User Management
    "FTR0000002", // Role Management
    "FTR0000003", // Employee Management
    "FTR0000004", // Office Management
    "FTR0000005", // Department Management
    "FTR0000006", // Division Management
    "FTR0000007", // Position Management
    "FTR0000008", // Organization Management
    "FTR0000009", // Leave Request
    "FTR0000010", // Leave Balance
    "FTR0000011", // Shift Management
  ];

  const permissionsToInsert: any[] = [];

  // ====================================================
  // 1. SUPER ADMIN (Full Access to Everything)
  // ====================================================
  allFeatures.forEach((feature_code) => {
    permissionsToInsert.push({
      role_code: superAdminRole,
      feature_code,
      can_create: 1,
      can_read: 1,
      can_update: 1,
      can_delete: 1,
      can_print: 1,
    });
  });

  // ====================================================
  // 2. ADMINISTRATOR / HR (Manage Data, but limited System control)
  // ====================================================
  // Groups for Admin
  const systemFeatures = ["FTR0000001", "FTR0000002"]; // Users, Roles
  const masterFeatures = [
    "FTR0000003", // Employee
    "FTR0000004", // Office
    "FTR0000005", // Dept
    "FTR0000006", // Div
    "FTR0000007", // Pos
    "FTR0000008", // Org
  ];
  const transactionFeatures = ["FTR0000009", "FTR0000010", "FTR0000011"]; // Leaves

  // Admin: Read Only for System Features (Cannot delete SuperAdmin, etc.)
  systemFeatures.forEach((feature_code) => {
    permissionsToInsert.push({
      role_code: adminRole,
      feature_code,
      can_create: 0,
      can_read: 1, // Can see users/roles
      can_update: 0,
      can_delete: 0,
      can_print: 0,
    });
  });

  // Admin: Full Access for Master Data & Transactions
  [...masterFeatures, ...transactionFeatures].forEach((feature_code) => {
    permissionsToInsert.push({
      role_code: adminRole,
      feature_code,
      can_create: 1,
      can_read: 1,
      can_update: 1,
      can_delete: 1,
      can_print: 1,
    });
  });

  // ====================================================
  // 3. EMPLOYEE (Limited Access)
  // ====================================================

  // Feature: Organization Structure (Read Only)
  permissionsToInsert.push({
    role_code: employeeRole,
    feature_code: "FTR0000008",
    can_create: 0,
    can_read: 1,
    can_update: 0,
    can_delete: 0,
    can_print: 0,
  });

  // Feature: Leave Request (Create & Read own)
  permissionsToInsert.push({
    role_code: employeeRole,
    feature_code: "FTR0000009",
    can_create: 1, // Can apply
    can_read: 1, // Can see history
    can_update: 0, // Cannot edit once submitted (business logic usually)
    can_delete: 0, // Cannot delete
    can_print: 1,
  });

  // Feature: Leave Balance (Read Only)
  permissionsToInsert.push({
    role_code: employeeRole,
    feature_code: "FTR0000010",
    can_create: 0,
    can_read: 1,
    can_update: 0,
    can_delete: 0,
    can_print: 0,
  });

  // ====================================================
  // Execute Insert
  // ====================================================
  await knex("role_permissions").insert(permissionsToInsert);
}
