import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Hapus data lama
  await knex("attendances").del();

  // 2. Buat 10 data absensi manual (DENGAN EMPLOYEE_CODE YANG BENAR)
  const attendances = [
    {
      attendance_code: "ABS0000001",
      employee_code: "EMP0000001", // DIUBAH
      session_code: "SSA0000001",
      check_in_time: "2025-11-11 08:30:15",
      check_out_time: "2025-11-11 17:00:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000002",
      employee_code: "EMP0000001", // DIUBAH
      session_code: "SSA0000002",
      check_in_time: "2025-11-12 09:10:05",
      check_out_time: "2025-11-12 17:01:00",
      check_in_status: "late",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000003",
      employee_code: "EMP0000002", // DIUBAH
      session_code: "SSA0000001",
      check_in_time: "2025-11-11 08:55:00",
      check_out_time: "2025-11-11 17:30:00",
      check_in_status: "in-time",
      check_out_status: "overtime",
    },
    {
      attendance_code: "ABS0000004",
      employee_code: "EMP0000002", // DIUBAH
      session_code: "SSA0000002",
      check_in_time: "2025-11-12 08:40:00",
      check_out_time: "2025-11-12 16:30:00",
      check_in_status: "in-time",
      check_out_status: "early",
    },
    {
      attendance_code: "ABS0000005",
      employee_code: "EMP0000003", // DIUBAH
      session_code: "SSA0000001",
      check_in_time: "2025-11-11 08:10:00",
      check_out_time: "2025-11-11 17:00:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000006",
      employee_code: "EMP0000003", // DIUBAH
      session_code: "SSA0000002",
      check_in_time: "2025-11-12 08:05:00",
      check_out_time: "2025-11-12 17:02:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000007",
      employee_code: "EMP0000004", // DIUBAH
      session_code: "SSA0000001",
      check_in_time: "2025-11-11 08:45:00",
      check_out_time: null,
      check_in_status: "in-time",
      check_out_status: "missed",
    },
    {
      attendance_code: "ABS0000008",
      employee_code: "EMP0000004", // DIUBAH
      session_code: "SSA0000002",
      check_in_time: "2025-11-12 08:50:00",
      check_out_time: "2025-11-12 17:05:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000009",
      employee_code: "EMP0000005", // DIUBAH
      session_code: "SSA0000001",
      check_in_time: "2025-11-11 08:59:00",
      check_out_time: "2025-11-11 17:00:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },
    {
      attendance_code: "ABS0000010",
      employee_code: "EMP0000005", // DIUBAH
      session_code: "SSA0000002",
      check_in_time: "2025-11-12 09:15:00",
      check_out_time: "2025-11-12 17:00:00",
      check_in_status: "late",
      check_out_status: "in-time",
    },
  ];

  // 3. Masukkan data ke database
  await knex("attendances").insert(attendances);
}
