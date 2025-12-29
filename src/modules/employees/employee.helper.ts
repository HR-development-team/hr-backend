import { EMPLOYEE_TABLE } from "@common/constants/database.js";
import { DatabaseError } from "@common/types/error.types.js";
import { db } from "@database/connection.js";
import { DatabaseErrorResponse, EmployeeServiceError, ValidationError } from "./employee.types.js";
import { API_STATUS } from "@common/constants/general.js";

/**
 * Function for generating employee code
 */
export async function generateEmployeeCode() {
  const PREFIX = "MR";
  const PAD_LENGTH = 4;

  const lastRow = await db(EMPLOYEE_TABLE)
    .select("employee_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.employee_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Handler database error
 */
export const handleEmployeesDatabaseError = (
  error: unknown
): DatabaseErrorResponse => {
  const dbError = error as DatabaseError;
  const validationErrors: ValidationError[] = [];

  // 1. Handle Duplicate Entry (Unique Constraint)
  if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
    const msg = dbError.sqlMessage || dbError.message || "";

    if (msg.includes("employee_code"))
      validationErrors.push({
        field: "employee_code",
        message: "Kode karyawan sudah ada.",
      });
    if (msg.includes("user_code"))
      validationErrors.push({
        field: "user_code",
        message: "Akun user sudah digunakan.",
      });
    if (msg.includes("ktp_number"))
      validationErrors.push({
        field: "ktp_number",
        message: "Nomor KTP sudah terdaftar.",
      });
    if (msg.includes("npwp"))
      validationErrors.push({
        field: "npwp",
        message: "Nomor NPWP sudah terdaftar.",
      });
    if (msg.includes("bpjs_ketenagakerjaan"))
      validationErrors.push({
        field: "bpjs_ketenagakerjaan",
        message: "Nomor BPJS Ketenagakerjaan sudah terdaftar.",
      });
    if (msg.includes("bpjs_kesehatan"))
      validationErrors.push({
        field: "bpjs_kesehatan",
        message: "Nomor BPJS Kesehatan sudah terdaftar.",
      });

    if (validationErrors.length > 0) {
      return {
        status: 400,
        apiStatus: API_STATUS.BAD_REQUEST, // "99"
        message: "Validasi Gagal (Duplikat Data)",
        errors: validationErrors,
      };
    }
  }

  // 2. Handle Foreign Key Error (Reference not found - Insert/Update)
  if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
    const msg = dbError.sqlMessage || dbError.message || "";

    if (msg.includes("shift_code"))
      validationErrors.push({
        field: "shift_code",
        message: "Kode shift tidak ditemukan.",
      });
    if (msg.includes("office_code"))
      validationErrors.push({
        field: "office_code",
        message: "Kode kantor tidak ditemukan.",
      });
    if (msg.includes("position_code"))
      validationErrors.push({
        field: "position_code",
        message: "Kode jabatan tidak ditemukan.",
      });

    // Fallback jika field tidak terdeteksi
    if (validationErrors.length === 0) {
      validationErrors.push({
        field: "unknown",
        message: "Data referensi tidak valid.",
      });
    }

    return {
      status: 400,
      apiStatus: API_STATUS.BAD_REQUEST, // "99"
      message: "Validasi Gagal (Data Referensi Tidak Ada)",
      errors: validationErrors,
    };
  }

  // 3. Handle Foreign Key Constraint (Cannot Delete)
  if (dbError.code === "ER_ROW_IS_REFERENCED" || dbError.errno === 1451) {
    return {
      status: 409,
      apiStatus: API_STATUS.CONFLICT, // "05"
      message:
        "Data tidak bisa dihapus karena sedang digunakan oleh data lain.",
    };
  }

  // Default Error (Server Error)
  return {
    status: 500,
    apiStatus: API_STATUS.FAILED, // "01"
    message: "Terjadi kesalahan pada server",
  };
};

export const isEmployeeServiceError = (
  error: unknown
): error is EmployeeServiceError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as any).status === "number" && // Pastikan statusnya angka
    "message" in error
  );
};

// Helper Baru: Mapping HTTP Status -> API Status
export const getEmployeeServiceErrorDetails = (error: EmployeeServiceError) => {
  let appStatus = API_STATUS.FAILED; // Default "01"

  switch (error.status) {
    case 400:
      appStatus = API_STATUS.BAD_REQUEST; // "99"
      break;
    case 401:
    case 403:
      appStatus = API_STATUS.UNAUTHORIZED; // "04"
      break;
    case 404:
      appStatus = API_STATUS.NOT_FOUND; // "03"
      break;
    case 409:
      appStatus = API_STATUS.CONFLICT; // "05"
      break;
    default:
      appStatus = API_STATUS.FAILED;
  }

  return {
    status: error.status,
    apiStatus: appStatus,
    message: error.message,
  };
};


