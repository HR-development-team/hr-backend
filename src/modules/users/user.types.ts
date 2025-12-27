export interface User {
  id: number;
  user_code: string;
  email: string;
  role_code: string;
  session_token: string;
  password: string;
  login_date: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserById {
  id: number;
  user_code: string;
  email: string;
  role_code: string;
  role_name: string;
  session_token: string;
  login_date: string;
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

export interface GetAllUserResponse {
  data: GetAllUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface UserOption {
  user_code: string;
  email: string;
  employee_name: string | null;
  role_name: string;
}
