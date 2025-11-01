import { db } from "@core/config/knex.js";

export interface AuthUser {
  id: number;
  email: string;
  password: string;
  employee_id: number;
  role: "admin" | "employee";
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Get user by email
 */
export const findUserByEmail = async (
  email: string
): Promise<AuthUser | null> => {
  const user = await db<AuthUser>("users").where({ email }).first();
  return user ?? null;
};

/**
 * Get user by id
 */
export const findUserById = async (id: number): Promise<AuthUser | null> => {
  const user = await db<AuthUser>("users").where({ id }).first();
  return user ?? null;
};
