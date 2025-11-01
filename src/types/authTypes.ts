export interface User {
  id: number;
  email: string;
  password: string;
  employee_id: number;
  role: "admin" | "employee";
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, "password">;
}
