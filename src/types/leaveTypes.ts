export interface LeaveType {
  id: number;
  name: string;
  deduction: number;
  description: string | null;
  created_at?: Date;
  updated_at?: Date;
}
