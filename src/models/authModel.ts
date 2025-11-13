import { db } from "@core/config/knex.js";
import { User } from "types/userTypes.js";

/**
 * Get user by email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db("users").where({ email }).first();
  return user ?? null;
};

/**
 * Get user by id
 */
export const findUserById = async (id: number): Promise<User | null> => {
  const user = await db("users").where({ id }).first();
  return user ?? null;
};
