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

export const getAllHolidays = async (
  officeCode?: string
): Promise<GetAllHolidays[]> => {
  const query = db(HOLIDAY_TABLE).select(
    `${HOLIDAY_TABLE}.id`,
    `${HOLIDAY_TABLE}.date`,
    `${HOLIDAY_TABLE}.description`
  );

  if (officeCode) {
    query.where("office_code", officeCode);
  }

  return query.orderBy("date", "asc");
};

export const getHolidayById = async (id: number): Promise<GetHolidayById> => {
  return await db(HOLIDAY_TABLE).where({ id }).select("*").first();
};

export const getHolidayByDate = async (
  date: string
): Promise<GetHolidayByDate> => {
  return await db(HOLIDAY_TABLE)
    .where(`${HOLIDAY_TABLE}.date`, date)
    .select("*")
    .first();
};

export const addHolidays = async (data: CreateHoliday): Promise<Holiday> => {
  const { office_code, department_code, date, description } = data;

  const [id] = await db(HOLIDAY_TABLE).insert({
    office_code,
    department_code,
    date,
    description,
  });

  return await getHolidayById(id);
};

export const editHolidays = async (id: number, data: UpdateHoliday) => {
  const { office_code, department_code, date, description } = data;

  await db(HOLIDAY_TABLE).where({ id }).update({
    office_code,
    department_code,
    date,
    description,
  });

  return await getHolidayById(id);
};

export const deleteHolidays = async (id: number) => {
  return await db(HOLIDAY_TABLE).where({ id }).del();
};
