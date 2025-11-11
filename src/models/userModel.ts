import { USER_TABLE } from "@constants/database.js";
import { db } from "@core/config/knex.js";
import {
  CreateUserData,
  GetAllUser,
  UpdateUserData,
  User,
} from "types/userTypes.js";

/**
 * Function for generating user code
 */
async function generateUserCode() {
  const PREFIX = "USR";
  const PAD_LENGTH = 7;

  const lastRow = await db(USER_TABLE)
    .select("user_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.user_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all user.
 */
export const getAllUsers = async (): Promise<GetAllUser[]> =>
  await db(USER_TABLE)
    .select(
      "users.id",
      "users.user_code",
      "users.email",
      "users.role",
      "users.employee_code",

      // Employee fields
      "master_employees.employee_code",
      "master_employees.full_name as employee_name"
    )
    .leftJoin(
      "master_employees",
      "users.employee_code",
      "master_employees.employee_code"
    );

/**
 * Get user by ID.
 */
export const getUsersById = async (
  id: number
): Promise<Omit<User, "password">> =>
  await db(USER_TABLE)
    .where({ id })
    .select("id", "user_code", "email", "role", "employee_code")
    .first();

/**
 * Creates new user.
 */
export const addUsers = async (
  data: CreateUserData
): Promise<Omit<User, "password">> => {
  const user_code = await generateUserCode();
  const userToInsert = {
    ...data,
    user_code,
  };
  const [id] = await db(USER_TABLE).insert(userToInsert);

  return db(USER_TABLE)
    .where({ id })
    .select("id", "user_code", "email", "role", "employee_code")
    .first();
};

/**
 * edit an existing user record.
 */
export const editUsers = async (
  data: UpdateUserData
): Promise<Omit<User, "password"> | null> => {
  const { id, ...updateData } = data;

  await db(USER_TABLE).where({ id }).update(updateData);
  return db(USER_TABLE)
    .where({ id })
    .select("id", "user_code", "email", "role", "employee_code")
    .first();
};

/**
 * Remove existing user
 */
export async function removeUsers(id: number): Promise<number> {
  return db(USER_TABLE).where({ id }).delete();
}
