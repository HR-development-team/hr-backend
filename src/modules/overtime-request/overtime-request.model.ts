import { db } from "@database/connection.js";
import { OVERTIME_REQUEST_TABLE } from "@constants/database.js";
import {
  OvertimeRequest,
  GetAllOvertimeRequest,
  GetOvertimeRequestById,
  CreateOvertimeRequest,
  UpdateOvertimeStatusData,
} from "./overtime-request.types.js";

const TABLE = OVERTIME_REQUEST_TABLE;
const USERS_TABLE = "users";

async function generateRequestCode() {
  const PREFIX = "OVT";
  const PAD_LENGTH = 7;

  const lastRow = await db(TABLE)
    .select("request_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.request_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

export const getAllOvertimeRequests = async (data: {
  userCode?: string;
  status?: "Pending" | "Approved" | "Rejected";
}): Promise<GetAllOvertimeRequest[]> => {
  const { userCode, status } = data;
  const APPROVER_ALIAS = "approver_user";

  let query = db(TABLE)
    .select(
      `${TABLE}.*`,
      `${USERS_TABLE}.email as employee_email`,
      `${APPROVER_ALIAS}.email as approval_email`
    )

    .leftJoin(
      `${USERS_TABLE}`,
      `${TABLE}.employee_code`,
      `${USERS_TABLE}.user_code`
    )
    .leftJoin(
      `${USERS_TABLE} as ${APPROVER_ALIAS}`,
      `${TABLE}.approved_by_id`,
      `${APPROVER_ALIAS}.id`
    );

  if (userCode) {
    query = query.where(`${TABLE}.employee_code`, userCode);
  }

  if (status) {
    query = query.where(`${TABLE}.status`, status);
  }

  return query;
};

export const getOvertimeRequestById = async (
  id: number
): Promise<GetOvertimeRequestById | null> => {
  const APPROVER_ALIAS = "approver_user";
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      `${USERS_TABLE}.email as employee_email`,
      `${APPROVER_ALIAS}.email as approval_email`
    )
    .leftJoin(
      `${USERS_TABLE}`,
      `${TABLE}.employee_code`,
      `${USERS_TABLE}.user_code`
    )

    .leftJoin(
      `${USERS_TABLE} as ${APPROVER_ALIAS}`,
      `${TABLE}.approved_by_id`,
      `${APPROVER_ALIAS}.id`
    )
    .where({ [`${TABLE}.id`]: id })
    .first();
};

export const addOvertimeRequest = async (
  data: CreateOvertimeRequest
): Promise<OvertimeRequest> => {
  const newRequestCode = await generateRequestCode();

  const overtimeToInsert = {
    request_code: newRequestCode,
    employee_code: data.employee_code,
    overtime_date: data.overtime_date,
    start_time: data.start_time,
    end_time: data.end_time,
    duration: data.duration,
    reason: data.reason,
  };

  const [id] = await db(TABLE).insert(overtimeToInsert);
  return db(TABLE).where({ id }).first();
};

export const editOvertimeRequestStatus = async (
  data: UpdateOvertimeStatusData
): Promise<OvertimeRequest | null> => {
  const { id, new_status, approved_by_id } = data;

  await db(TABLE).where({ id }).update({
    status: new_status,
    approval_date: db.fn.now(),
    approved_by_id,
  });
  return db(TABLE).where({ id }).first();
};

export async function removeOvertimeRequest(id: number): Promise<number> {
  return db(TABLE).where({ id }).del();
}
