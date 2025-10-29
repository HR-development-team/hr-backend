export interface CreateEmployeeData {
  first_name: string;
  last_name: string;
  contact_phone: string | null | undefined;
  address: string | null | undefined;
  join_date: string;
  position_id: number;
}

export interface UpdateEmployeeData {
  id: number;
  first_name?: string;
  last_name?: string;
  contact_phone?: string | null;
  address?: string | null;
  position_id?: number;
}
