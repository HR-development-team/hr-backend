import { USER_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { User } from "@modules/users/user.types.js";

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

/**
 * Update user session token
 */
export const updateUserSessionToken = async (
  email: string,
  sessionToken: string
) => {
  await db(USER_TABLE)
    .where({ email })
    .update({ session_token: sessionToken, login_date: new Date() });
};

export const deleteUserSessionToken = async (userCode: string) => {
  await db(USER_TABLE)
    .where("user_code", userCode)
    .update("session_token", null);
};
