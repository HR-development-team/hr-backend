export interface Department {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DepartmentLeader {
  employee_code: string;
  name: string;
  role: string;
  position: string;
}

export interface GetAllDepartment {
  id: number;
  department_code: string;
  office_code: string;
  name: string;
  description: string;
  leader: DepartmentLeader | null;
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
  leader: DepartmentLeader | null;
}

export interface DepartmentOption {
  department_code: string;
  name: string;
}

export interface GetAllDepartmentResponse {
  data: GetAllDepartment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
