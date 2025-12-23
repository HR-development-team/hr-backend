export interface Shift {
  id: number;
  shift_code: string;
  office_code: string;
  name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  late_tolerance_minutes: number;
  check_in_limit_minutes: number;
  check_out_limit_minutes: number;
  work_days: number[];
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllShifts extends Shift {
  // If we ever need to calculate "duration" on the fly for the list view,
  // we could add it here. For now, it mirrors the base Shift.
}

export interface CreateShift {
  office_code: string;
  name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  late_tolerance_minutes: number;
  check_in_limit_minutes: number;
  check_out_limit_minutes: number;
  work_days: number[];
}

export interface UpdateShift {
  id: number;
  office_code?: string;
  name?: string;
  start_time?: string;
  end_time?: string;
  is_overnight?: boolean;
  late_tolerance_minutes?: number;
  check_in_limit_minutes?: number;
  check_out_limit_minutes?: number;
  work_days?: number[];
}
