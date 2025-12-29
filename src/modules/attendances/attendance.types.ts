export interface Attendance {
  id: number;
  attendance_code: string;
  employee_code: string;
  check_in_time: Date;
  check_out_time: Date | null;
  check_in_status: "in-time" | "late" | "absent";
  check_out_status: "in-time" | "early" | "overtime" | "missed";
  shift_code: string;
  date: string;
  late_minutes: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllAttendance {
  id: number;
  attendance_code: string;
  employee_code: string;
  check_in_time: string;
  check_out_time: string | null;
  check_in_status: "in-time" | "late" | "absent";
  check_out_status: "in-time" | "early" | "overtime" | "missed";
  employee_name: string;
  shift_code: string;
  date: string;
  late_minutes: string;
  overtime_minutes: number;
}

export interface GetAllAttendanceResponse {
  data: GetAllAttendance[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface CheckInPayload {
  employee_code: string;
  // session_code: string;
  check_in_time: Date;
  check_in_status: "in-time" | "late" | "absent";
  shift_code: string;
  date: string;
  late_minutes?: number;
  overtime_minutes?: number;
}

export interface CheckInResult {
  success: boolean;
  statusCode: number;
  message: string;
  data?: unknown;
}

export interface CheckOutPayload {
  // employee_code: string;
  check_out_time: Date;
  // session_code: string;
  check_out_status: "in-time" | "early" | "overtime" | "missed";
  overtime_minutes: number;
  updated_at: Date;
}

export interface CheckOutResult extends CheckInResult {}

export interface GetEmployeeShift {
  office_code: string;
  shift_code: string;
  shift_name: string;
  work_days: number[];
  start_time: string;
  end_time: string;
  check_in_limit_minutes: number;
  late_tolerance_minutes: number;
  office_lat: number;
  office_long: number;
  radius_meters: number;
}

export interface ShiftTimes {
  shiftStartTime: Date;
  shiftEndTime: Date;
  openGateTime: Date;
  closedGateTime: Date;
  lateThresholdTime: Date;
}

export interface ShiftDetailUI {
  name: string;
  start: string;
  end: string;
  open_at: string;
}

export interface AttendanceUIState {
  status_message: string;
  button_label: string;
  button_variant: "disabled" | "primary" | "warning" | "success" | "danger";
  can_check_in: boolean;
  can_check_out: boolean;
  server_time: string;
  shift_detail: ShiftDetailUI;
}
