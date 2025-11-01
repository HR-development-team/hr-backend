export interface Attendance {
  id: number;
  employee_id: number;
  check_in_time: Date;
  check_out_time: Date | null;
  work_date: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CheckInPayload {
  employee_id: number;
  check_in_time: Date;
  work_date: string;
  note?: string | null;
}

export interface CheckOutPayload {
  employee_id: number;
  check_out_time: Date;
  work_date: string;
  note?: string | null;
}
