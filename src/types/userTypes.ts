export interface User {
  id: number;
  email: string;
  role: "admin" | "employee";
  password: string;
  employee_code: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllUser {
  id: number;
  email: string;
  role: "admin" | "employee";
  employee_code: string;
  employee_name: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  employee_code: string;
  role: "admin" | "employee";
}

export interface UpdateUserData {
  id: number;
  email?: string;
  password?: string;
  role?: "admin" | "employee";
  employee_code?: string;
}
