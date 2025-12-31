import { db } from "@database/connection.js";
import {
  CreateHoliday,
  GetAllHolidays,
  GetHolidayByDate,
  GetHolidayById,
  Holiday,
  UpdateHoliday,
} from "./holidays.types.js";
import { HOLIDAY_TABLE } from "@common/constants/database.js";
import { Knex } from "knex";

/**
 * Get all holiday
 */
export const getAllHolidays = async (
  officeCode?: string
): Promise<GetAllHolidays[]> => {
  const query = db(HOLIDAY_TABLE).select(
    `${HOLIDAY_TABLE}.id`,
    `${HOLIDAY_TABLE}.office_code`,
    `${HOLIDAY_TABLE}.date`,
    `${HOLIDAY_TABLE}.description`
  );

  if (officeCode) {
    query.where("office_code", officeCode);
  }

  return query.orderBy("date", "asc");
};

/**
 * Get holiday by id
 */
export const getHolidayById = async (id: number): Promise<GetHolidayById> => {
  return await db(HOLIDAY_TABLE).where({ id }).select("*").first();
};

/**
 * Get holiday by date
 */
export const getHolidayByDate = async (
  date: string
): Promise<GetHolidayByDate> => {
  return await db(HOLIDAY_TABLE)
    .where(`${HOLIDAY_TABLE}.date`, date)
    .select("*")
    .first();
};

/**
 * Get holiday by date and office code
 */
export const getHolidayDateAndOffice = async (
  date: string,
  officeCode: string
) => {
  return await db(HOLIDAY_TABLE)
    .where("date", date)
    .andWhere((builder) => {
      builder.whereNull("office_code").orWhere("office_code", officeCode);
    })
    .first();
};

/**
 * Create holiday
 */
export const addHolidays = async (
  connection: Knex.Transaction,
  data: CreateHoliday
): Promise<Holiday> => {
  const { office_code, date, description } = data;

  const [id] = await connection(HOLIDAY_TABLE).insert({
    office_code,
    date,
    description,
  });

  return await connection(HOLIDAY_TABLE).select("*").where({ id }).first();
};

/**
 * Update holiday
 */
export const editHolidays = async (
  connection: Knex.Transaction,
  id: number,
  data: UpdateHoliday
) => {
  const { office_code, date, description } = data;

  await connection(HOLIDAY_TABLE).where({ id }).update({
    office_code,
    date,
    description,
  });

  return await connection(HOLIDAY_TABLE).select("*").where({ id }).first();
};

/**
 * Update holiday
 */
export const removeHolidays = async (
  connection: Knex.Transaction,
  id: number
) => {
  return await connection(HOLIDAY_TABLE).where({ id }).del();
};
