// status.types.ts
export interface EmploymentStatus {
  id: number;
  status_code: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetEmploymentStatusById extends EmploymentStatus {}

export interface GetEmploymentStatusByCode extends EmploymentStatus {}

export interface GetAllEmploymentStatus {
  id: number;
  status_code: string;
  name: string;
  description?: string;
}

export interface CreateEmploymentStatus {
  name: string;
  description?: string | null;
}

export interface UpdateEmploymentStatus {
  id: number;
  name?: string;
  description?: string | null;
}

export interface GetAllEmploymentStatusResponse {
  data: GetAllEmploymentStatus[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface EmploymentStatusOption {
  status_code: string;
  name: string;
}
