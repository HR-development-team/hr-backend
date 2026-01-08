export interface Position {
  id: number;
  parent_position_code: string | null;
  position_code: string;
  division_code: string | null;
  department_code: string | null;
  name: string;
  base_salary: string;
  sort_order: string;
  created_at?: Date;
  updated_at?: Date;
  description: string | null;
}

export interface GetAllPosition
  extends Omit<Position, "updated_at" | "created_at"> {
  office_code: string;
  office_name: string;
  department_code: string;
  department_name: string;
  division_name: string;
}

export interface GetAllPositionResponse {
  data: GetAllPosition[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface GetPositionById extends Position {
  office_code: string;
  office_name: string;
  department_code: string;
  department_name: string;
  division_name: string;
}

export interface CreatePosition {
  division_code: string | null;
  department_code: string | null;
  parent_position_code: string | null;
  name: string;
  base_salary: number;
  description?: string;
}

export interface UpdatePosition {
  id: number;
  name?: string;
  division_code?: string | null;
  department_code?: string | null;
  parent_division_code?: string;
  base_salary?: number;
  description?: string;
}

export interface PositionOption {
  position_code: string;
  name: string;
}

// Tipe data mentah dari database (Flat)
export interface PositionRaw {
  position_code: string;
  name: string;
  parent_position_code: string | null; // <-- Kunci pembentuk hierarki
  employee_code: string | null;
  employee_name: string | null;
}

// Tipe data hasil output (Nested / Bersarang)
export interface OrganizationTree {
  position_code: string;
  name: string;
  employee_code: string | null;
  employee_name: string | null;
  children: OrganizationTree[]; // <-- Rekursif
}
