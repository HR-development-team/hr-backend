import { db } from "@core/config/knex.js";
import { LeaveType } from "types/leaveTypes.js";

const LEAVE_TYPE_TABLE = "master_leave_types";

/**
 * Get all master leave type.
 */
export const getAllMasterLeaveTypes = async (): Promise<LeaveType[]> =>
  await db(LEAVE_TYPE_TABLE).select("*");

/**
 * Get leave type by ID.
 */
export const getMasterLeaveTypesById = async (
  id: number
): Promise<LeaveType | null> =>
  await db(LEAVE_TYPE_TABLE).where({ id }).first();

/**
 * Creates new leave type.
 */
export const addMasterLeaveTypes = async ({
  name,
  description = null,
  deduction,
}: {
  name: string;
  deduction: number;
  description?: string | null;
}): Promise<LeaveType> => {
  const [id] = await db(LEAVE_TYPE_TABLE).insert({
    name,
    deduction,
    description,
  });

  return db(LEAVE_TYPE_TABLE).where({ id, description }).first();
};

/**
 * edit an existing leave type record.
 */
export const editMasterLeaveTypes = async ({
  id,
  name,
  description,
  deduction,
}: {
  name?: string;
  id: number;
  deduction?: number;
  description?: string | null;
}): Promise<LeaveType | null> => {
  await db(LEAVE_TYPE_TABLE)
    .where({ id })
    .update({ name, deduction, description, updated_at: new Date() });
  return db(LEAVE_TYPE_TABLE).where({ id }).first();
};

/**
 * Remove existing leave type
 */
export async function removeMasterLeaveTypes(id: number): Promise<number> {
  return db(LEAVE_TYPE_TABLE).where({ id }).delete();
}
