import { checkOfficeScope } from "@modules/offices/office.helper.js";
import {
  addMasterEmployees,
  editMasterEmployees,
  getMasterEmployeesById,
} from "./employee.model.js";
import { CreateEmployee, UpdateEmployee } from "./employee.types.js";
import { validateShiftScopeService } from "@modules/shifts/shift.service.js";

/**
 * Create employee service
 */
export const createEmployeeService = async (
  currentUserOfficeCode: string | null,
  data: CreateEmployee
) => {
  const hasAccess = await checkOfficeScope(
    currentUserOfficeCode,
    data.office_code
  );

  if (!hasAccess) {
    throw {
      status: 403,
      message: "Anda tidak memiliki akses ke kantor ini",
    };
  }

  if (data.shift_code) {
    const isValidShift = await validateShiftScopeService(
      data.shift_code || null,
      data.office_code
    );

    if (!isValidShift) {
      throw {
        status: 400,
        message: "Shift tidak valid untuk kantor ini",
      };
    }
  }

  return await addMasterEmployees(data);
};

/**
 * Update employee service
 */
export const updateEmployeeService = async (
  id: number,
  currentUserOfficeCode: string | null,
  data: UpdateEmployee
) => {
  const existingEmployee = await getMasterEmployeesById(id);

  if (!existingEmployee) {
    throw {
      status: 404,
      message: "Karyawan tidak ditemukan",
    };
  }

  const targetOfficeCode = data.office_code ?? existingEmployee.office_code;

  const accessOld = await checkOfficeScope(
    currentUserOfficeCode,
    existingEmployee.office_code
  );

  if (!accessOld) {
    throw {
      status: 403,
      message: "Anda tidak berhak mengedit karyawan ini",
    };
  }

  const accessNew = await checkOfficeScope(
    currentUserOfficeCode,
    targetOfficeCode
  );
  if (!accessNew)
    throw {
      status: 403,
      message: "Anda tidak berhak memindahkan karyawan ke kantor ini",
    };

  if (data.shift_code || data.office_code) {
    const targetShift = data.shift_code ?? existingEmployee.shift_code;
    const validShift = await validateShiftScopeService(
      targetShift,
      targetOfficeCode
    );
    if (!validShift)
      throw { status: 400, message: "Shift tidak valid untuk kantor target" };
  }

  return await editMasterEmployees(id, { ...data });
};
