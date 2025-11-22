import { User } from "@modules/users/user.types.js";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, "password">;
}
