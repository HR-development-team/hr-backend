export interface User {
  id: number;
  user_code: string;
  email: string;
  role_code: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserById {
  id: number;
  user_code: string;
  email: string;
  role_code: string;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface GetAllUser {
  id: number;
  user_code: string;
  email: string;
  role_code: string;
  role_name: string;
  employee_name: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role_code: string;
}

export interface UpdateUserData {
  id: number;
  email?: string;
  password?: string;
  role_code?: string;
}
