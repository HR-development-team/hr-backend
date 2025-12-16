import { DEPARTMENT_TABLE } from "@common/constants/database.js";
import { GetDepartmentDetail } from "./department.types.js";
import { db } from "@database/connection.js";
import { Knex } from "knex";

export const isDepartmentExist = async (
  office_code: string,
  name: string
): Promise<GetDepartmentDetail> => {
  const result = await db(DEPARTMENT_TABLE)
    .where({
      office_code: office_code,
      name: name,
    })
    .first();

  return result;
};

export const getDepartmentsById = async (
  id: number
): Promise<GetDepartmentDetail> => {
  const result = db(DEPARTMENT_TABLE).where("id", id).first();

  return result;
};

export const departmentQueryBuilder = (): Knex.QueryBuilder => {
  return db(DEPARTMENT_TABLE);
};
