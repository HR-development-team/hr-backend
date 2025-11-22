import { PAYROLL_PERIODS_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import {
  CreatePayrollPeriodData,
  PayrollPeriod,
  UpdatePayrollPeriodStatus,
} from "./payroll-period.types.js";

/**
 * Get all payroll periods.
 */
export const getAllPayrollPeriods = async (): Promise<PayrollPeriod[]> =>
  await db(PAYROLL_PERIODS_TABLE).select("*");

/**
 * Get payroll period by ID.
 */
export const getPayrollPeriodsById = async (
  id: number
): Promise<PayrollPeriod | null> =>
  await db(PAYROLL_PERIODS_TABLE).where({ id }).first();

/**
 * Creates new payroll period.
 */
export const addPayrollPeriods = async (
  data: CreatePayrollPeriodData
): Promise<PayrollPeriod> => {
  const [id] = await db(PAYROLL_PERIODS_TABLE).insert(data);

  return db(PAYROLL_PERIODS_TABLE).where({ id }).first();
};

/**
 * Edit status of payroll periods
 */
export const editStatusPayrollPeriods = async (
  data: UpdatePayrollPeriodStatus
) => {
  const { id, status } = data;
  await db(PAYROLL_PERIODS_TABLE).where({ id }).update({
    status,
  });
  return db(PAYROLL_PERIODS_TABLE).where({ id }).first();
};

/**
 * Remove existing payroll periods
 */
export async function removePayrollPeriods(id: number): Promise<number> {
  return db(PAYROLL_PERIODS_TABLE).where({ id }).delete();
}
