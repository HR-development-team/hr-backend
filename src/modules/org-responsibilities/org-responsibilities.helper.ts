import { format } from "date-fns";
import {
  GetAllOrgResponsibilities,
  GetOrgResponsibilitiesById,
  OrgResponsibilities,
} from "./org-responsibilities.types.js";

const safeDateFormat = (dateValue: string | Date | null): string => {
  if (!dateValue) {
    return "-";
  }

  let dateObj: Date;

  if (dateValue instanceof Date) {
    dateObj = dateValue;
  } else if (dateValue === "string") {
    const cleaningString = dateValue.replace(" ", "T");
    dateObj = new Date(cleaningString);
  } else {
    return "-";
  }

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  return format(dateObj, "yyyy-MM-dd");
};

export const toOrgResponsibilitiesPostOrPutResponse = (
  data: OrgResponsibilities
): OrgResponsibilities => ({
  id: data.id,
  scope_type: data.scope_type,
  scope_code: data.scope_code,
  employee_code: data.employee_code,
  role: data.role,
  start_date: safeDateFormat(data.start_date),
  end_date: safeDateFormat(data.end_date),
  is_active: data.is_active,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const toOrgResponsibilitiesSimpleResponse = (
  data: GetAllOrgResponsibilities
): GetAllOrgResponsibilities => ({
  id: data.id,
  scope_type: data.scope_type,
  scope_code: data.scope_code,
  employee_code: data.employee_code,
  employee_name: data.employee_name,
  role: data.role,
  start_date: safeDateFormat(data.start_date),
  end_date: safeDateFormat(data.end_date),
  is_active: data.is_active,
  unit_name: data.unit_name,
  // created_at: data.created_at,
  // updated_at: data.updated_at,
});

export const toOrgResponsibilitiesDetailResponse = (
  data: GetOrgResponsibilitiesById
): GetOrgResponsibilitiesById => ({
  id: data.id,
  scope_type: data.scope_type,
  scope_code: data.scope_code,
  employee_code: data.employee_code,
  employee_name: data.employee_name,
  role: data.role,
  start_date: safeDateFormat(data.start_date),
  end_date: safeDateFormat(data.end_date),
  is_active: data.is_active,
  unit_name: data.unit_name,
  created_at: data.created_at,
  updated_at: data.updated_at,
});
