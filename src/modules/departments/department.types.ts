export interface Department {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetAllDepartment {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description: string;
}

export interface CreateDepartment {
  office_code: string;
  name: string;
  description?: string;
}

export interface UpdateDepartment {
  id: number;
  office_code?: string;
  name?: string;
  description?: string;
}

export interface GetDepartmentDetail extends Department {
  office_name: string;
}
