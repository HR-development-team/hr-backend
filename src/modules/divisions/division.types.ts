export interface Division {
  id: number;
  division_code: string;
  department_code: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DivisionLeader {
  employee_code: string;
  name: string;
  role: string;
  position: string;
}

export interface GetDivisionById extends Division {
  office_code: string;
  office_name: string;
  department_name: string;
  leader: DivisionLeader | null;
}

export interface GetDivisionByCode extends GetDivisionById {}

export interface GetAllDivision {
  id: number;
  office_code: string;
  office_name: string;
  division_code: string;
  department_code: string;
  department_name: string;
  name: string;
  leader: DivisionLeader | null;
}

export interface CreateDivision {
  name: string;
  department_code: string;
  description?: string;
}

export interface UpdateDivision {
  id: number;
  name?: string;
  department_code?: string;
  description?: string;
}

export interface DivisionOption {
  division_code: string;
  name: string;
}

export interface GetAllDivisionResponse {
  data: GetAllDivision[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}
