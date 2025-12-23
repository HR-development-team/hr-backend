export interface Attendance {
  id: number;
  attendance_code: string;
  employee_code: string;
  session_code: string;
  check_in_time: Date;
  check_out_time: Date | null;
  check_in_status: "in-time" | "late" | "absent";
  check_out_status: "in-time" | "early" | "overtime" | "missed";
  shift_code: string
  date: string
  late_minutes: string
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllAttendance {
  id: number;
  attendance_code: string;
  employee_code: string;
  session_code: string;
  check_in_time: Date;
  check_out_time: Date | null;
  check_in_status: "in-time" | "late" | "absent";
  check_out_status: "in-time" | "early" | "overtime" | "missed";
  employee_name: string;
  session_status: string;
  session_date: Date;
  shift_code: string
  date: string
  late_minutes: string
}

export interface CheckInPayload {
  employee_code: string;
  session_code: string;
  check_in_time: Date;
  check_in_status: "in-time" | "late" | "absent";
}

export interface CheckOutPayload {
  employee_code: string;
  check_out_time: Date;
  session_code: string;
  check_out_status: "in-time" | "early" | "overtime" | "missed";
}
