export interface CreateUserData {
  email: string;
  password: string;
  employee_id: number;
  role: "admin" | "employee";
}

export interface UpdateUserData {
  id: number;
  email?: string;
  password?: string;
  employee_id?: number;
  role?: "admin" | "employee";
}
