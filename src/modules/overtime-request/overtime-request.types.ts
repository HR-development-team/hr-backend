export interface OvertimeRequest {
  id: number;
  request_code: string;
  employee_code: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  duration: number; // Menit
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approved_by_id: number | null;
  approval_date: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetOvertimeRequestById extends OvertimeRequest {
  employee_email: string; // Ambil email dari tabel users
  approval_email: string;
}

export interface GetAllOvertimeRequest extends GetOvertimeRequestById {}

export interface CreateOvertimeRequest {
  employee_code: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  reason: string;
}

export interface UpdateOvertimeStatusData {
  id: number;
  new_status: "Approved" | "Rejected";
  approved_by_id: number;
}
