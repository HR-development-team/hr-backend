import { db } from "@database/connection.js";
import { EMPLOYEE_TABLE, ROLE_TABLE, USER_TABLE } from "@constants/database.js";
import {
  CreateUserData,
  GetAllUserResponse,
  GetUserById,
  UpdateUserData,
  User,
  UserOption,
} from "./user.types.js";

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
export const getAllUsers = async (
  page: number,
  limit: number,
  search: string,
  roleCode: string
): Promise<GetAllUserResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query (Joins)
  const query = db(USER_TABLE)
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${EMPLOYEE_TABLE}.user_code`,
      `${USER_TABLE}.user_code`
    )
    .leftJoin(
      `${ROLE_TABLE}`,
      `${ROLE_TABLE}.role_code`,
      `${USER_TABLE}.role_code`
    );

  // 2. Search Logic (Email, User Code, or Employee Name)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${USER_TABLE}.email`, "like", `%${search}%`)
        .orWhere(`${USER_TABLE}.user_code`, "like", `%${search}%`)
        .orWhere(`${EMPLOYEE_TABLE}.full_name`, "like", `%${search}%`);
    });
  }

  // 3. Filter: Role
  if (roleCode) {
    query.where(`${USER_TABLE}.role_code`, roleCode);
  }

  // 4. Count Query
  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${USER_TABLE}.id as total`)
    .first();

  // 5. Data Query
  const dataQuery = query
    .select(
      `${USER_TABLE}.id`,
      `${USER_TABLE}.user_code`,
      `${USER_TABLE}.email`,
      `${USER_TABLE}.role_code`,
      `${ROLE_TABLE}.name as role_name`,
      `${EMPLOYEE_TABLE}.full_name as employee_name`,
      `${USER_TABLE}.login_date` // Useful to show "Last Login"
    )
    .orderBy(`${USER_TABLE}.id`, "asc")
    .limit(limit)
    .offset(offset);

  // 6. Execute
  const [totalResult, data] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_page: totalPage,
    },
  };
};

/**
 * Get user by ID.
 */
export const getUsersById = async (id: number): Promise<GetUserById> =>
  await db(USER_TABLE)
    .select(
      `${USER_TABLE}.id`,
      `${USER_TABLE}.user_code`,
      `${USER_TABLE}.email`,
      `${USER_TABLE}.role_code`,
      `${ROLE_TABLE}.name as role_name`
    )
    .leftJoin(ROLE_TABLE, `${ROLE_TABLE}.role_code`, `${USER_TABLE}.role_code`)
    .where({ [`${USER_TABLE}.id`]: id })
    .first();

export const getUserByCode = async (code: string) => {
  await db(USER_TABLE)
    .select(
      `${USER_TABLE}.id`,
      `${USER_TABLE}.email`,
      `${USER_TABLE}.role_code`,
      `${USER_TABLE}.name as role_name`
    )
    .leftJoin(ROLE_TABLE, `${ROLE_TABLE}.role_code`, `${USER_TABLE}.role_code`);
};

export const getUserOptions = async (
  search: string,
  roleCode: string
): Promise<UserOption[]> => {
  // 1. Base Query
  const query = db(USER_TABLE)
    .leftJoin(
      `${ROLE_TABLE}`,
      `${ROLE_TABLE}.role_code`,
      `${USER_TABLE}.role_code`
    )
    .select(
      `${USER_TABLE}.user_code`,
      `${USER_TABLE}.email`,
      `${ROLE_TABLE}.name as role_name`
    );

  // 2. FILTER: Role (e.g., Get only "Admin" users)
  if (roleCode) {
    query.where(`${USER_TABLE}.role_code`, roleCode);
  }

  // 3. SEARCH: Autocomplete (Email, Name, or Code)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${USER_TABLE}.email`, "like", `%${search}%`)
        .orWhere(`${USER_TABLE}.user_code`, "like", `%${search}%`);
    });
  }

  return query.orderBy(`${USER_TABLE}.email`, "asc");
};

/**
 * Creates new user.
 */
export const addUsers = async (
  data: CreateUserData
): Promise<Omit<User, "password">> => {
  const user_code = await generateUserCode();
  const userToInsert = {
    email: data.email,
    password: data.password,
    role_code: data.role_code,
    user_code,
  };
  const [id] = await db(USER_TABLE).insert(userToInsert);
  return db(USER_TABLE)
    .where({ id })
    .select("id", "user_code", "email", "role_code")
    .first();
};

/**
 * edit an existing user record.
 */
export const editUsers = async (
  data: UpdateUserData
): Promise<Omit<User, "password"> | null> => {
  const { id } = data;
  const userToUpdate = {
    email: data.email,
    password: data.password,
    role_code: data.role_code,
  };

  await db(USER_TABLE).where({ id }).update(userToUpdate);
  return db(USER_TABLE)
    .where({ id })
    .select("id", "user_code", "email", "role_code")
    .first();
};

/**
 * Remove existing user
 */
export async function removeUsers(id: number): Promise<number> {
  return db(USER_TABLE).where({ id }).delete();
}
