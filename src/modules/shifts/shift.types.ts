export interface Shift {
  id: number;
  shift_code: string;
  office_code?: string | null;
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

// If we ever need to calculate "duration" on the fly for the list view,
// we could add it here. For now, it mirrors the base Shift.
export interface GetAllShifts
  extends Omit<Shift, "created_at" | "updated_at"> {}

export interface GetAllShiftResponse {
  data: GetAllShifts[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
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

export interface StartEndShift {
  start_time: string;
  end_time: string;
}

export interface ShiftOptions
  extends Pick<
    Shift,
    "shift_code" | "name" | "start_time" | "end_time" | "office_code"
  > {}
