export interface AttendanceSession {
  id: number;
  session_code: string;
  date: string;
  status: "open" | "closed";
  open_time: string;
  cutoff_time: string;
  close_time: string;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllAttendanceSession {
  id: number;
  date: string;
  status: "open" | "closed";
  open_time: string;
  cutoff_time: string;
  close_time: string;
  created_by: string;
  created_by_role: string;
  created_by_employee_code: string;
  created_by_full_name: string;
}

export interface GetAttendanceById extends AttendanceSession {
  created_by_role: string;
  created_by_employee_code: string;
  created_by_full_name: string;
}

export interface CreateAttendanceSession {
  date: string;
  status: "open" | "closed";
  open_time: string;
  cutoff_time: string;
  close_time: string;
  created_by: string;
}

export interface UpdateAttendanceSession {
  id: number;
  date?: string;
  status?: "open" | "closed";
  open_time?: string;
  cutoff_time?: string;
  close_time?: string;
}
